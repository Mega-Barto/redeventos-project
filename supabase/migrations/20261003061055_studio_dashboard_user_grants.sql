-- Studio Table Editor lista entidades con privilegios de dashboard_user
-- (pg_has_role / has_table_privilege). Sin este GRANT, el esquema public
-- aparece vacío aunque las tablas existan.

grant usage on schema public to dashboard_user;

grant select, insert, update, delete, truncate, references, trigger
  on all tables in schema public to dashboard_user;

grant usage, select, update
  on all sequences in schema public to dashboard_user;

alter default privileges for role postgres in schema public
  grant select, insert, update, delete, truncate, references, trigger
  on tables to dashboard_user;

alter default privileges for role postgres in schema public
  grant usage, select, update on sequences to dashboard_user;
