<template>
    <div>
        <ErrorBoundary>
            <div class="admin-container">
                <AppHeader />
                <Nuxt />
            </div>
        </ErrorBoundary>
    </div>
</template>

<script>
export default {

};
</script>

<style scoped>
.admin-container {
  height: 100vh;
  padding: 0 40px;
}
</style>