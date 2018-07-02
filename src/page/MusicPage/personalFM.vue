<template>
  <section>
    私人fm
  </section>
</template>

<script>
import {FM} from '../../api/getData'

export default {
  name: 'personalFM',

  methods: {
    async personalFmGet () {
      try {
        let res = await FM()
      } catch (e) {
        throw new Error(e)
      }
    }
  }
}
</script>

