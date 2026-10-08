-- Espacio no es aporte de local sponsor: se ofrece vía venue_sponsor / venues.

update public.profiles
set contribution_types = array_remove(contribution_types, 'venue'::public.need_type)
where contribution_types @> array['venue'::public.need_type];
