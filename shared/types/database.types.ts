export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type Table<Row extends Record<string, unknown>> = {
  Row: Row
  Insert: { [K in keyof Row]?: Row[K] }
  Update: { [K in keyof Row]?: Row[K] }
  Relationships: []
}

type View<Row extends Record<string, unknown>> = {
  Row: Row
  Insert: { [K in keyof Row]?: Row[K] }
  Update: { [K in keyof Row]?: Row[K] }
  Relationships: []
}

export type Database = {
  public: {
    Tables: {
      profiles: Table<{
        id: string
        display_name: string
        slug: string
        email: string
        instagram: string | null
        website: string | null
        city: 'pereira' | 'dosquebradas' | null
        contribution_types: ('venue' | 'products' | 'food' | 'equipment' | 'services' | 'diffusion')[]
        contribution_description: string | null
        avatar_storage_path: string | null
        disaffiliated_at: string | null
        hidden_at: string | null
        created_at: string
        updated_at: string
      }>
      profile_direct_contacts: Table<{
        profile_id: string
        whatsapp: string | null
        phone: string | null
        updated_at: string
      }>
      profile_roles: Table<{
        profile_id: string
        role: 'organizer' | 'venue_sponsor' | 'local_sponsor' | 'moderator'
        created_at: string
      }>
      registration_commitments: Table<{
        profile_id: string
        privacy_version: string
        commitment_version: string
        accepted_at: string
      }>
      events: Table<{
        id: string
        organizer_id: string
        title: string
        slug: string
        category:
          | 'tecnologia'
          | 'literatura'
          | 'cine'
          | 'musica'
          | 'educacion'
          | 'emprendimiento'
          | 'cultura'
          | 'comunidades'
          | 'networking'
        city: 'pereira' | 'dosquebradas'
        starts_on: string | null
        date_range_label: string | null
        expected_attendees: number
        description: string
        audience: string
        sponsor_benefit: string
        rsvp_url: string
        place_name: string | null
        venue_id: string | null
        status: 'draft' | 'published' | 'public' | 'completed' | 'cancelled'
        hidden_at: string | null
        created_at: string
        updated_at: string
      }>
      event_needs: Table<{
        id: string
        event_id: string
        type: 'venue' | 'products' | 'food' | 'equipment' | 'services' | 'diffusion'
        description: string
        quantity_requested: number | null
        quantity_covered: number
        unit: string | null
        status: 'open' | 'partial' | 'covered' | 'cancelled'
        created_at: string
        updated_at: string
      }>
      venues: Table<{
        id: string
        owner_id: string
        name: string
        slug: string
        city: 'pereira' | 'dosquebradas'
        zone: string
        capacity: number
        equipment: string
        support_mode: 'free' | 'depends' | 'rental_only'
        description: string
        cover_storage_path: string | null
        created_at: string
        updated_at: string
      }>
      venue_media: Table<{
        id: string
        venue_id: string
        storage_path: string
        sort_order: number
        created_at: string
      }>
      offers: Table<{
        id: string
        event_need_id: string
        event_id: string
        proposer_id: string
        recipient_id: string
        venue_id: string | null
        quantity: number
        offer_on: string
        note: string
        status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
        created_at: string
        updated_at: string
      }>
      matches: Table<{
        id: string
        offer_id: string
        event_need_id: string
        event_id: string
        organizer_id: string
        sponsor_id: string
        status: 'accepted' | 'completed' | 'breached' | 'cancelled'
        created_at: string
      }>
      match_commitments: Table<{
        id: string
        match_id: string
        what: string
        quantity: number
        when_on: string
        accepted_at: string
      }>
      evidence: Table<{
        id: string
        event_id: string
        submitted_by: string
        attendance_count: number
        venue_note: string
        contributions_note: string
        status: 'submitted' | 'approved' | 'rejected'
        review_note: string | null
        reviewed_by: string | null
        created_at: string
        updated_at: string
      }>
      event_media: Table<{
        id: string
        event_id: string
        storage_path: string
        kind: 'evidence' | 'case_highlight'
        is_public: boolean
        created_at: string
      }>
      reports: Table<{
        id: string
        reporter_id: string
        target_type: 'event' | 'profile'
        target_id: string
        reason: string
        created_at: string
        resolved_at: string | null
      }>
    }
    Views: {
      venue_calendar_days: View<{
        venue_id: string
        day: string
        kind: string
      }>
      public_cases: View<{
        id: string
        slug: string
        title: string
        category: Database['public']['Tables']['events']['Row']['category']
        city: 'pereira' | 'dosquebradas'
        starts_on: string | null
        place_name: string | null
        audience: string
        sponsor_benefit: string
        attendance_count: number
        venue_note: string
        contributions_note: string
        cover_path: string | null
      }>
      public_case_covers: View<{
        event_id: string
        event_slug: string
        storage_path: string
        created_at: string
      }>
      public_case_media: View<{
        event_id: string
        event_slug: string
        storage_path: string
        created_at: string
        sort_order: number
      }>
    }
    Functions: {
      accept_offer: { Args: { p_offer_id: string }; Returns: string }
      reject_offer: { Args: { p_offer_id: string }; Returns: undefined }
      cancel_offer: { Args: { p_offer_id: string }; Returns: undefined }
      review_evidence: {
        Args: { p_evidence_id: string; p_decision: 'approved' | 'rejected'; p_note: string }
        Returns: undefined
      }
      hide_target: { Args: { p_type: string; p_id: string }; Returns: undefined }
      disaffiliate_profile: { Args: { p_profile_id: string }; Returns: undefined }
      sponsor_completed_count: { Args: { p_profile_id: string }; Returns: number }
      is_moderator: { Args: Record<string, never>; Returns: boolean }
    }
    Enums: {
      city: 'pereira' | 'dosquebradas'
      app_role: 'organizer' | 'venue_sponsor' | 'local_sponsor' | 'moderator'
      need_type: 'venue' | 'products' | 'food' | 'equipment' | 'services' | 'diffusion'
      venue_support_mode: 'free' | 'depends' | 'rental_only'
      event_category: Database['public']['Tables']['events']['Row']['category']
      event_status: Database['public']['Tables']['events']['Row']['status']
      need_status: Database['public']['Tables']['event_needs']['Row']['status']
      offer_status: Database['public']['Tables']['offers']['Row']['status']
      match_status: Database['public']['Tables']['matches']['Row']['status']
      evidence_status: Database['public']['Tables']['evidence']['Row']['status']
    }
    CompositeTypes: Record<string, never>
  }
}

export type Tables<Name extends keyof Database['public']['Tables']> = Database['public']['Tables'][Name]['Row']
export type Views<Name extends keyof Database['public']['Views']> = Database['public']['Views'][Name]['Row']
