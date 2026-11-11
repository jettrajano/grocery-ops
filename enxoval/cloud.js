(() => {
  const PROJECT_URL = 'https://zxhpvpckkvholtrhyaod.supabase.co';
  const PUBLISHABLE_KEY = 'sb_publishable_n8ib_yQTcgoTUSbifxJ4yA_T7KY1Eua';
  const PRODUCT_TABLE = 'enxoval_products';
  const OBSERVATION_TABLE = 'enxoval_observations';
  const authGate = document.querySelector('#authGate');
  const appShell = document.querySelector('#appShell');
  const loginForm = document.querySelector('#loginForm');
  const loginEmail = document.querySelector('#loginEmail');
  const loginPassword = document.querySelector('#loginPassword');
  const loginButton = document.querySelector('#loginButton');
  const authError = document.querySelector('#authError');
  const signOutButton = document.querySelector('#signOutButton');
  const syncStatus = document.querySelector('#syncStatus');
  const memberPanel = document.querySelector('#memberPanel');
  const memberForm = document.querySelector('#memberForm');
  const memberEmail = document.querySelector('#memberEmail');
  const memberSubmitButton = document.querySelector('#memberSubmitButton');
  const memberFeedback = document.querySelector('#memberFeedback');
  let client = null;
  let activeUserId = '';
  let householdId = '';
  let syncPromise = null;
  let syncTimer = null;
  let realtimeTimer = null;
  let realtimeChannel = null;

  function showAuth() {
    authGate.hidden = false;
    appShell.hidden = true;
    signOutButton.hidden = true;
    activeUserId = '';
    householdId = '';
    if (realtimeChannel && client) client.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }

  function showApp() {
    authError.hidden = true;
    authGate.hidden = true;
    appShell.hidden = false;
    signOutButton.hidden = false;
  }

  function setStatus(message, mode = '') {
    if (!syncStatus) return;
    syncStatus.classList.remove('is-pending', 'is-error');
    if (mode) syncStatus.classList.add(mode);
    syncStatus.lastChild.textContent = ' ' + message;
  }

  function showAuthError(message) {
    authError.textContent = message;
    authError.hidden = false;
  }

  function friendlyError(error) {
    const code = error && error.code ? String(error.code) : '';
    if (code === '42P01' || code === 'PGRST205' || code === '42883' || code === 'PGRST202') {
      return 'O banco ainda precisa receber as tabelas e regras do aplicativo.';
    }
    if (code === '42501' || code === 'PGRST301') {
      return 'Esta conta ainda não está vinculada à lista da família. Peça ao responsável para liberar o acesso e tente novamente.';
    }
    return 'Não foi possível sincronizar agora. Seus dados continuam guardados neste aparelho; tente novamente quando a conexão estiver disponível.';
  }

  function timestamp(value) {
    const parsed = Date.parse(value || '');
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function productToRow(product, id, now) {
    return {
      household_id: householdId,
      id: product.id,
      name: product.name,
      category: product.category || 'Outros',
      priority: product.priority || 'Baixa',
      target_week: product.targetWeek || null,
      responsible: product.responsible || '',
      preferred_store: product.preferredStore || '',
      product_link: product.productLink || '',
      reference_price: product.referencePrice || null,
      custom: Boolean(product.custom),
      updated_at: product.updatedAt || now,
    };
  }

  function observationToRow(observation, now) {
    return {
      household_id: householdId,
      id: observation.id,
      product_id: observation.productId,
      store: observation.store,
      price: observation.price,
      source: observation.source || '',
      link: observation.link || '',
      notes: observation.notes || '',
      observed_at: observation.observedAt,
      updated_at: observation.updatedAt || now,
      is_deleted: false,
    };
  }

  function productFromRow(row) {
    return {
      id: String(row.id),
      name: row.name,
      category: row.category || 'Outros',
      priority: row.priority || 'Baixa',
      targetWeek: row.target_week,
      responsible: row.responsible || '',
      preferredStore: row.preferred_store || '',
      productLink: row.product_link || '',
      referencePrice: row.reference_price === null ? null : Number(row.reference_price),
      custom: Boolean(row.custom),
      updatedAt: row.updated_at,
    };
  }

  function observationFromRow(row) {
    return {
      id: String(row.id),
      productId: String(row.product_id),
      store: row.store,
      price: Number(row.price),
      source: row.source || '',
      link: row.link || '',
      notes: row.notes || '',
      observedAt: row.observed_at,
      updatedAt: row.updated_at,
      isDeleted: Boolean(row.is_deleted),
    };
  }

  async function fetchRows() {
    const results = await Promise.all([
      client.from(PRODUCT_TABLE).select('*').eq('household_id', householdId),
      client.from(OBSERVATION_TABLE).select('*').eq('household_id', householdId),
    ]);
    const productResult = results[0];
    const observationResult = results[1];
    if (productResult.error) throw productResult.error;
    if (observationResult.error) throw observationResult.error;
    return { products: productResult.data || [], observations: observationResult.data || [] };
  }

  function mergeLocalAndCloud(localState, rows, deletedIds) {
    const deleted = new Set(deletedIds.map(String));
    const remoteProducts = new Map(rows.products.map((row) => [String(row.id), productFromRow(row)]));
    const remoteObservations = new Map(rows.observations
      .filter((row) => !row.is_deleted)
      .map((row) => [String(row.id), observationFromRow(row)]));
    for (const local of localState.products) {
      const remote = remoteProducts.get(String(local.id));
      if (!remote || timestamp(local.updatedAt) > timestamp(remote.updatedAt)) {
        remoteProducts.set(String(local.id), local);
      }
    }
    for (const local of localState.observations) {
      if (deleted.has(String(local.id))) continue;
      const remote = remoteObservations.get(String(local.id));
      if (!remote || timestamp(local.updatedAt) > timestamp(remote.updatedAt)) {
        remoteObservations.set(String(local.id), local);
      }
    }
    return {
      version: 1,
      products: Array.from(remoteProducts.values()),
      observations: Array.from(remoteObservations.values()).filter((item) => remoteProducts.has(String(item.productId))),
    };
  }

  async function syncNow() {
    if (!client || !activeUserId || !navigator.onLine) return;
    if (syncPromise) return syncPromise;
    syncPromise = (async () => {
      setStatus('Sincronizando…', 'is-pending');
      const householdResult = await client.rpc('ensure_enxoval_household');
      if (householdResult.error) throw householdResult.error;
      householdId = householdResult.data;
      if (!householdId) throw new Error('Não foi possível localizar o grupo familiar.');
      const ownerResult = await client.rpc('is_enxoval_household_owner');
      if (ownerResult.error) throw ownerResult.error;
      if (memberPanel) memberPanel.hidden = !ownerResult.data;

      const localState = window.enxovalApp.getState();
      const deletedIds = new Set(window.enxovalApp.getDeletedObservationIds());
      let cloudRows = await fetchRows();
      for (const row of cloudRows.observations) {
        if (row.is_deleted) deletedIds.add(String(row.id));
      }
      const cloudProducts = new Map(cloudRows.products.map((row) => [String(row.id), row]));
      const cloudObservations = new Map(cloudRows.observations.map((row) => [String(row.id), row]));
      const now = new Date().toISOString();
      const productsToUpload = localState.products
        .filter((item) => {
          const remote = cloudProducts.get(String(item.id));
          return !remote || timestamp(item.updatedAt) > timestamp(remote.updated_at);
        })
        .map((item) => productToRow(item, activeUserId, now));
      const observationsToUpload = localState.observations
        .filter((item) => {
          if (deletedIds.has(String(item.id))) return false;
          const remote = cloudObservations.get(String(item.id));
          return !remote || timestamp(item.updatedAt) > timestamp(remote.updated_at);
        })
        .map((item) => observationToRow(item, now));

      for (const id of deletedIds) {
        const remote = cloudObservations.get(String(id));
        if (remote && !remote.is_deleted) {
          const result = await client.from(OBSERVATION_TABLE)
            .update({ is_deleted: true, updated_at: now })
            .eq('household_id', householdId)
            .eq('id', id);
          if (result.error) throw result.error;
        }
      }
      if (productsToUpload.length) {
        const result = await client.from(PRODUCT_TABLE).upsert(productsToUpload, { onConflict: 'household_id,id' });
        if (result.error) throw result.error;
      }
      if (observationsToUpload.length) {
        const result = await client.from(OBSERVATION_TABLE).upsert(observationsToUpload, { onConflict: 'household_id,id' });
        if (result.error) throw result.error;
      }

      cloudRows = await fetchRows();
      for (const row of cloudRows.observations) {
        if (row.is_deleted) deletedIds.add(String(row.id));
      }
      window.enxovalApp.rememberDeletedObservationIds([...deletedIds]);
      const merged = mergeLocalAndCloud(localState, cloudRows, [...deletedIds]);
      window.enxovalApp.replaceState(merged);
      setStatus('Sincronizado');
      return true;
    })().catch((error) => {
      console.warn('Enxoval cloud sync failed:', error && error.code ? error.code : 'network');
      setStatus('Sincronização pendente', 'is-error');
      if (window.enxovalApp && typeof window.enxovalApp.showToast === 'function') {
        window.enxovalApp.showToast(friendlyError(error));
      }
      return false;
    }).finally(() => {
      syncPromise = null;
    });
    return syncPromise;
  }

  function scheduleSync() {
    if (!activeUserId || !navigator.onLine) {
      if (activeUserId) setStatus('Aguardando conexão', 'is-pending');
      return;
    }
    window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(() => syncNow(), 500);
  }

  function subscribeToChanges() {
    if (!client || !householdId) return;
    if (realtimeChannel) client.removeChannel(realtimeChannel);
    realtimeChannel = client.channel('enxoval-household-' + householdId)
      .on('postgres_changes', { event: '*', schema: 'public', table: PRODUCT_TABLE, filter: 'household_id=eq.' + householdId }, () => {
        window.clearTimeout(realtimeTimer);
        realtimeTimer = window.setTimeout(() => syncNow(), 350);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: OBSERVATION_TABLE, filter: 'household_id=eq.' + householdId }, () => {
        window.clearTimeout(realtimeTimer);
        realtimeTimer = window.setTimeout(() => syncNow(), 350);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setStatus('Sincronizado');
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setStatus('Tempo real indisponível', 'is-pending');
      });
  }

  async function activateSession(session) {
    const user = session && session.user;
    if (!user) {
      showAuth();
      return;
    }
    if (activeUserId === user.id) return;
    if (!window.enxovalApp.switchAccount(user.id)) {
      await client.auth.signOut();
      showAuth();
      showAuthError('Não consegui separar com segurança os dados locais desta conta. Exporte um backup antes de tentar novamente.');
      return;
    }
    activeUserId = user.id;
    showApp();
    setStatus(navigator.onLine ? 'Sincronizando…' : 'Aguardando conexão', 'is-pending');
    if (!navigator.onLine) return;
    const ok = await syncNow();
    if (ok) subscribeToChanges();
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    authError.hidden = true;
    if (!client) {
      showAuthError('O serviço de login não carregou. Conecte-se à internet e atualize a página.');
      return;
    }
    loginButton.disabled = true;
    loginButton.textContent = 'Entrando…';
    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    try {
      const result = await client.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      loginPassword.value = '';
      await activateSession(result.data.session);
    } catch (error) {
      showAuthError('Não foi possível entrar. Confira o e-mail e a senha cadastrados ou conclua o convite recebido por e-mail.');
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = 'Entrar e sincronizar';
    }
  });

  signOutButton.addEventListener('click', async () => {
    signOutButton.disabled = true;
    if (client) await client.auth.signOut();
    showAuth();
    signOutButton.disabled = false;
    loginPassword.value = '';
    loginEmail.focus();
  });


  memberForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!client || !activeUserId || !navigator.onLine) {
      memberFeedback.textContent = 'Conecte-se à internet antes de liberar o acesso.';
      memberFeedback.hidden = false;
      return;
    }
    memberFeedback.hidden = true;
    memberSubmitButton.disabled = true;
    memberSubmitButton.textContent = 'Conferindo conta…';
    const email = memberEmail.value.trim();
    try {
      const result = await client.rpc('add_enxoval_household_member_by_email', { target_email: email });
      if (result.error) throw result.error;
      memberFeedback.textContent = 'Acesso liberado. A pessoa já pode entrar no app com o e-mail dela.';
      memberFeedback.dataset.state = 'success';
      memberFeedback.hidden = false;
      memberEmail.value = '';
    } catch (error) {
      const message = error && error.message ? error.message : '';
      memberFeedback.textContent = message.includes('Nenhuma conta confirmada')
        ? 'Ainda não encontramos uma conta confirmada com esse e-mail. Confira se está escrito corretamente e se a pessoa já aceitou o convite por e-mail.'
        : message.includes('já faz parte')
          ? 'Essa pessoa já tem acesso à lista.'
          : message.includes('outra lista')
            ? 'Essa conta já está vinculada a outra lista familiar e não pode ser adicionada aqui.'
            : 'Não foi possível liberar o acesso. Confira se a pessoa aceitou o convite e tente novamente.';
      memberFeedback.dataset.state = 'error';
      memberFeedback.hidden = false;
    } finally {
      memberSubmitButton.disabled = false;
      memberSubmitButton.textContent = 'Dar acesso à lista';
    }
  });

  window.addEventListener('enxoval:state-changed', scheduleSync);
  window.addEventListener('online', () => {
    if (!activeUserId) return;
    syncNow().then((ok) => { if (ok) subscribeToChanges(); });
  });

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    showAuthError('Não foi possível carregar o componente de acesso ao banco. Conecte-se à internet e atualize a página.');
    return;
  }

  client = window.supabase.createClient(PROJECT_URL, PUBLISHABLE_KEY, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
  });
  window.enxovalCloud = { client };

  client.auth.onAuthStateChange((_event, session) => {
    window.setTimeout(() => activateSession(session), 0);
  });
  client.auth.getSession().then(({ data, error }) => {
    if (error) {
      showAuthError('Não foi possível conferir sua sessão. Entre novamente com seu e-mail e senha.');
      return;
    }
    if (data.session) activateSession(data.session);
    else showAuth();
  });
})();