<template>
    <div>
        <ErrorBoundary>
            <div class="default-container">
                <AppHeader />
                <div class="main-container">
                    <Nuxt />
                </div>
                <AppFooter />
            </div>
        </ErrorBoundary>
    </div>
</template>

<script>
export default {

};
</script>
<style>
body, html {
  height: 100%;
}
.default-container {
  background-image: linear-gradient(to right bottom, rgba(2, 0, 36, 0.8), rgba(0, 212, 255, 0.8)), url("/img/hero.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  height: 100%;

    /* Apply padding on screens that are larger than 840px */
  @media screen and (min-width: 840px) {
    padding: 0 40px;
  }
}

.main-container {
    display: flex;
    min-width: 100%;
    align-items: center;
    color: #FFF;
    min-height: 80vh;
}
</style>