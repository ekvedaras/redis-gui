import Dialog from '@/components/Modals/Dialog'

export default {
  methods: {
    async afterDeleteItem () {

    },
    deleteItem (item, action) {
      this.$modal.show(Dialog, {
        text: `Are you sure you want to delete <b>${(typeof item === 'object' ? item.label : item).substr(0, 50)}</b> item from ${this.name}?`,
        handler: () => {
          this.$store.dispatch(action, { keyName: this.name, item }).then(async () => {
            await this.afterDeleteItem()
            this.loadKeys()
          })
          this.$modal.hide('dialog')
        },
      }, { name: 'dialog' })
    },
  },
}
