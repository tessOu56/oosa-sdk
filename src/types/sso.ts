
// ========== generated ==========
export type AuthMethod = 'login' | 'registration' | 'recovery' | 'verification' | 'settings' | 'error' | 'logout';
export type AuthenticateSSOParams = {
  provider: 'line'|'google'|'apple';
  flowId: string;
  method: 'registration'|'login'
  csrfToken: string
};
export type SubmitSelfServiceLoginFlowBody = {
};
export type {
  UiContainer,
  LoginFlow as SelfServiceLoginFlow,
  UiNode,
} from '../apis/generated'
// ========== 共用 ==========

export interface ApiBase {
  status: number
  message: string
}

export interface ErrorMessage {
  code: number
  status: string
  reason: string
  message: string
}

// ========== Flow ==========

export interface FlowNode {
  type: string
  group: string
  attributes: {
    name: string
    type: string
    value?: string
    autocomplete?: string
    required?: boolean
    disabled: boolean
    node_type: string
  }
  messages: {
    id?: number
    text?: string
    type?: string
    context?: {
      property?: string
      min_length?: number
      actual_length?: number
    }
  }[]
  meta: {
    label?: {
      id: number
      text: string
      type: string
      context: {
        title?: string
        reason?: string
        provider?: string
        provider_id?: string
      }
    }
  }
}

export interface FlowRes extends ApiBase {
  data: {
    id?: string
    type: string
    created_at?: Date | string
    expires_at: Date | string
    updated_at?: Date | string
    issued_at: Date | string
    organization_id: string | null
    refresh?: boolean
    request_url: string
    requested_aal?: string
    return_to: string
    state: string
    active?: string
    ui: {
      action: string
      method: string
      nodes: FlowNode[]
      messages?: {
        id: number
        text: string
        type: string
      }[]
    }
  }
}

export interface InitRes extends ApiBase {
  data: {
    return_to: string
  }
}

// ========== Session ==========

export interface SessionNode {
  action: string
  redirect_browser_to?: string
  flow?: {
    id: string
    verifiable_address: string
    url: string
  }
}

export interface SessionRes extends ApiBase {
  data: {
    session: Session
    identity: Identity
    continue_with: SessionNode[]
  }
}

export interface Session {
  id: string
  active: boolean
  expires_at: string
  authenticated_at: string
  authenticator_assurance_level: string
  authentication_methods: {
    method: string
    aal: string
    completed_at: string
  }[]
  issued_at: string
  identity: Identity
  devices: {
    id: string
    ip_address: string
    user_agent: string
    location: string
  }[]
}

export interface Identity {
  id: string
  schema_id: string
  schema_url: string
  state: string
  state_changed_at: string
  traits: {
    name: string
    language: 'zh-TW' | 'en'
    picture: string
    email: string
    username: string
  }
  verifiable_addresses: {
    id: string
    value: string
    verified: boolean
    via: string
    status: string
    created_at: string
    updated_at: string
  }[]
  recovery_addresses: {
    id: string
    value: string
    via: string
    created_at: string
    updated_at: string
  }[]
  metadata_public: null
  created_at: string
  updated_at: string
  organization_id: null
}

// ========== Error ==========

export interface ErrorSessionRes extends ApiBase {
  error: {
    code: number
    debug: string
    details: {}
    id: string
    message: string
    reason: string
    request: string
    status: string
  }
}

export interface ErrorRes extends ApiBase {
  data: {
    id: string
    error: ErrorMessage
    created_at: string
    updated_at: string
  }
}