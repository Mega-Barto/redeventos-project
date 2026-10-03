-- Algunas necesidades no se miden por cantidad. Pedido y unidad van juntos o ambos quedan vacíos.

alter table public.event_needs
  alter column quantity_requested drop not null,
  alter column unit drop not null;

alter table public.event_needs
  add constraint event_needs_quantity_and_unit_together
  check ((quantity_requested is null) = (unit is null));

create or replace function public.accept_offer(p_offer_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_offer public.offers%rowtype;
  v_need public.event_needs%rowtype;
  v_event public.events%rowtype;
  v_match_id uuid;
  v_next numeric(12, 2);
  v_status public.need_status;
  v_organizer uuid;
  v_sponsor uuid;
begin
  if auth.uid() is null then
    raise exception 'Debes entrar para aceptar una propuesta';
  end if;

  select * into v_offer from public.offers where id = p_offer_id for update;
  if not found then
    raise exception 'Propuesta no encontrada';
  end if;
  if v_offer.status <> 'pending' then
    raise exception 'La propuesta ya no está pendiente';
  end if;
  if v_offer.recipient_id <> auth.uid() then
    raise exception 'Solo quien recibe la propuesta puede aceptarla';
  end if;

  select * into v_need from public.event_needs where id = v_offer.event_need_id for update;
  select * into v_event from public.events where id = v_offer.event_id for update;
  if v_event.status not in ('published', 'public') or v_need.status not in ('open', 'partial') then
    raise exception 'Esa necesidad ya no está abierta';
  end if;

  if v_need.quantity_requested is null then
    v_status := 'covered';
    v_next := v_need.quantity_covered;
  else
    if v_offer.quantity > (v_need.quantity_requested - v_need.quantity_covered) then
      raise exception 'La cantidad supera lo que falta por cubrir';
    end if;

    v_next := v_need.quantity_covered + v_offer.quantity;
    if v_next >= v_need.quantity_requested then
      v_status := 'covered';
    elsif v_next > 0 then
      v_status := 'partial';
    else
      v_status := 'open';
    end if;
  end if;

  perform set_config('redeventos.coverage_write', '1', true);

  if v_event.organizer_id = v_offer.proposer_id then
    v_organizer := v_offer.proposer_id;
    v_sponsor := v_offer.recipient_id;
  else
    v_organizer := v_offer.recipient_id;
    v_sponsor := v_offer.proposer_id;
  end if;

  update public.offers set status = 'accepted' where id = v_offer.id;
  update public.event_needs
    set quantity_covered = v_next, status = v_status
    where id = v_need.id;

  insert into public.matches (offer_id, event_need_id, event_id, organizer_id, sponsor_id)
  values (v_offer.id, v_need.id, v_event.id, v_organizer, v_sponsor)
  returning id into v_match_id;

  insert into public.match_commitments (match_id, what, quantity, when_on)
  values (v_match_id, v_need.description, v_offer.quantity, v_offer.offer_on);

  return v_match_id;
end;
$$;
