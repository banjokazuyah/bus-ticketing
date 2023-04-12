<template>
    <div>
        <slot />
    </div>
</template>

<script>
export default {
    errorCaptured() {
        this.$router.replace({ path: "/error" });
    },
};
</script>