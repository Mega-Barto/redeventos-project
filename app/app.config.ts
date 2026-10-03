export default defineAppConfig({
  ui: {
    colors: {
      primary: 'agua',
      secondary: 'cyan',
      neutral: 'slate',
      success: 'emerald',
      info: 'cyan',
      warning: 'amber',
      error: 'rose',
    },
    container: {
      base: 'mx-auto w-full max-w-(--ui-container) px-4 sm:px-8 lg:px-12',
    },
    pageCard: {
      variants: {
        outline: {
          root: 'bg-default/70 backdrop-blur-lg ring ring-default',
        },
      },
    },
    pageHeader: {
      slots: {
        root: 'relative border-b border-default bg-default/55 py-8 backdrop-blur-md',
        container: 'mx-auto w-full max-w-(--ui-container) px-4 sm:px-8 lg:px-12',
      },
    },
    pageHero: {
      slots: {
        container: 'flex flex-col gap-8 px-4 py-12 sm:px-8 sm:py-16 lg:grid lg:px-12 lg:py-20',
        wrapper: 'rounded-2xl bg-default/50 p-6 backdrop-blur-md sm:p-10',
      },
    },
    pageSection: {
      slots: {
        root: 'scroll-mt-24',
        container: 'flex flex-col gap-8 px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20',
        header: 'rounded-2xl bg-default/50 p-6 backdrop-blur-md sm:p-10',
        body: 'mt-8',
      },
      compoundVariants: [
        {
          orientation: 'vertical',
          description: true,
          class: { body: 'mt-8' },
        },
        {
          orientation: 'vertical',
          title: true,
          class: { body: 'mt-8' },
        },
      ],
    },
    pageCTA: {
      slots: {
        root: 'relative isolate',
        container: 'flex flex-col gap-8 px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20',
        wrapper: 'rounded-2xl bg-default/50 p-6 backdrop-blur-md ring ring-default sm:p-10',
      },
      variants: {
        variant: {
          outline: {
            root: 'bg-transparent ring-0',
          },
        },
      },
    },
  },
})
