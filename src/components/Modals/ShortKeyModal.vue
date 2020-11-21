<template>
  <Modal title="Keymap">
    <table>
      <tr>
        <th>Focus search</th>
        <td><KeyboardKey>/</KeyboardKey></td>
      </tr>
      <tr>
        <th>Focus key list<br/>or key items search</th>
        <td>
          <KeyboardKey>/</KeyboardKey> for key items or key list.<br/>
          <KeyboardKey>CTRL</KeyboardKey> + <KeyboardKey>/</KeyboardKey> for always key list.
        </td>
      </tr>
      <tr>
        <th>Add new key or key item</th>
        <td>
          <KeyboardKey>A</KeyboardKey> for key item or whole key.<br/>
          <KeyboardKey>CTRL</KeyboardKey> + <KeyboardKey>A</KeyboardKey> for always whole key.
        </td>
      </tr>
      <tr>
        <th>Refresh key or key list</th>
        <td>
          <KeyboardKey>R</KeyboardKey> for key content or key list.<br/>
          <KeyboardKey>CTRL</KeyboardKey> + <KeyboardKey>R</KeyboardKey> for always key list.
        </td>
      </tr>
      <tr>
        <th>Edit key name</th>
        <td><KeyboardKey>E</KeyboardKey></td>
      </tr>
      <tr>
        <th>Delete key</th>
        <td><KeyboardKey>D</KeyboardKey></td>
      </tr>
      <tr>
        <th>Set TTL</th>
        <td><KeyboardKey>T</KeyboardKey></td>
      </tr>
      <tr>
        <th>Open server info</th>
        <td><KeyboardKey>I</KeyboardKey></td>
      </tr>
      <tr>
        <th>Open console</th>
        <td><KeyboardKey>C</KeyboardKey></td>
      </tr>
      <tr>
        <th>Open settings</th>
        <td><KeyboardKey>S</KeyboardKey></td>
      </tr>
      <tr>
        <th>Open keymap</th>
        <td><KeyboardKey>?</KeyboardKey></td>
      </tr>
    </table>
  </Modal>
</template>

<script>
import Modal from '@/components/Modals/Modal'
import KeyboardKey from '@/components/Elements/KeyboardKey'

export default {
  name: 'ShortKeyModal',
  components: { KeyboardKey, Modal },
}
</script>

<style scoped>
  table th {
    text-align: right;
    white-space: nowrap;
  }

  table td {
    text-align: left;
    width: 100%;
  }
</style>
