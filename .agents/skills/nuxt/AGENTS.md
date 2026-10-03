# Nuxt — Redeventos

Además de la skill upstream en [SKILL.md](./SKILL.md), en este repo aplica una regla **obligatoria** de UI:

## Fragmentación de componentes y contenido

Antes de crear o ampliar páginas y componentes en `app/`, lee:

**[references/best-practices-component-fragmentation.md](./references/best-practices-component-fragmentation.md)**

Resumen: páginas orquestan; secciones en `app/components/<feature>/`; copy en `shared/content/` o `*.content.ts`; presentacionales sin lógica de negocio ni bloques largos de texto en templates.
