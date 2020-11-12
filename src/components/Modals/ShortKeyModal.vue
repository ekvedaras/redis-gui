<template>
  <Modal title="Keymap">
    <table>
      <tr>
        <th>Focus search</th>
        <td>/</td>
      </tr>
      <tr>
        <th>Focus key list search</th>
        <td>CTRL + / (or /)</td>
      </tr>
      <tr>
        <th>Add new key item</th>
        <td>A</td>
      </tr>
      <tr>
        <th>Add new key</th>
        <td>CTRL + A (or A)</td>
      </tr>
      <tr>
        <th>Refresh key</th>
        <td>R</td>
      </tr>
      <tr>
        <th>Refresh key list</th>
        <td>CTRL + R</td>
      </tr>
      <tr>
        <th>Edit key name</th>
        <td>E</td>
      </tr>
      <tr>
        <th>Delete key</th>
        <td>D</td>
      </tr>
      <tr>
        <th>Set TTL</th>
        <td>T</td>
      </tr>
      <tr>
        <th>Open server info</th>
        <td>I</td>
      </tr>
      <tr>
        <th>Open console</th>
        <td>C</td>
      </tr>
      <tr>
        <th>Open settings</th>
        <td>S</td>
      </tr>
      <tr>
        <th>Open keymap</th>
        <td>?</td>
      </tr>
    </table>
  </Modal>
</template>

<script>
import Modal from '@/components/Modals/Modal'

export default {
  name: 'ShortKeyModal',
  components: { Modal },
}
</script>

<style scoped>

</style>
