<template>
	<v-app light>
		<v-content>
			<!--			<v-container>-->
			<nuxt/>
			<!--			</v-container>-->
		</v-content>
	</v-app>
</template>

<script>
	export default {
		data() {
			return {
				clipped:     false,
				drawer:      false,
				fixed:       false,
				items:       [],
				miniVariant: false,
				right:       true,
				rightDrawer: false,
				title:       'Vuetify.js'
			};
		}
	};
</script>
