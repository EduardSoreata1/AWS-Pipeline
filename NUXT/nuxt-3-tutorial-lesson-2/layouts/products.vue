<template>
    <div>
        <header class="shadow-sm bg-black">
            <nav class="container mx-auto p-4">
                <NuxtLink to="https://www.continental.com/" target="blank" class="font-bold text-[#ffa500]"> Continental </NuxtLink>
            </nav>
        </header>

        <div class="container mx-auto p-4">
            <slot />
        </div>

        <footer class="container mx-auto p-4 flex justify-between border-t-2">
            <ul class="flex gap-4">
                <li><NuxtLink to ="/"> Home </NuxtLink></li>
                <li><NuxtLink to ="/about"> About </NuxtLink></li>
                <li><NuxtLink to ="/products"> Products </NuxtLink></li>
            </ul>
        </footer>
    </div>
</template>

<style scoped>
    .router-link-exact-active{
        color: white;
    }
</style>