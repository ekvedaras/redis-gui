export default {
  methods: {
    async afterDeleteItem () {

    },
    deleteItem (item, action) {
      this.$modal.show('dialog', {
        title: 'Confirm',
        text: `Are you sure you want to delete <b>${(typeof item === 'object' ? item.label : item).substr(0, 50)}</b> item from ${this.name}?`,
        buttons: [
          {
            title: 'Cancel',
            handler: () => this.$modal.hide('dialog'),
          },
          {
            title: 'Confirm',
            handler: () => {
              this.$store.dispatch(action, { keyName: this.name, item }).then(async () => {
                await this.afterDeleteItem()
                this.loadKeys()
              })
              this.$modal.hide('dialog')
            },
          },
        ],
      })
    },
  },
}
