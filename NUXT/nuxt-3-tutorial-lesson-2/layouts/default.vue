<template>
    <div>
        <header class="shadow-sm">
            <nav class="dropdown">
                <NuxtLink to="https://www.continental.com/" target="blank" class="font-bold text-[#ffa500]"> Continental </NuxtLink>
                <ul class="flex gap-4">
                    <li><NuxtLink to ="/" class = "btn"> Home </NuxtLink></li>
                    <li><NuxtLink to ="/about" class = "btn"> About </NuxtLink></li>
                    <li><NuxtLink to ="/products" class="btn"> Products </NuxtLink></li>
                </ul>
            </nav>
        </header>

        <div class="container mx-auto p-4">
            <slot />
        </div>
    </div>


<footer class="absolute place-content-center bottom-0 bg-white rounded-lg shadow m-4 dark:bg-gray-800 ">
    <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" class="hover:underline">Flowbite™</a>. All Rights Reserved.
    </span>
    <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
            <a href="#" class="hover:underline me-4 md:me-6">About</a>
        </li>
        <li>
            <a href="#" class="hover:underline me-4 md:me-6">Privacy Policy</a>
        </li>
        <li>
            <a href="#" class="hover:underline me-4 md:me-6">Licensing</a>
        </li>
        <li>
            <a href="#" class="hover:underline">Contact</a>
        </li>
    </ul>
    </div>
</footer>

</template>

<style scoped>
    .router-link-exact-active{
        color: white;
    } 
</style>