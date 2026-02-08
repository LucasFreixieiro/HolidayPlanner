<template>
    <header class="flex h-14 items-center px-6 block">
        <NavigationMenu :viewport="false" class="w-full container justify-start max-w-screen">
            <NavigationMenuList class="ml-auto">
                <NavModeToggle />
            </NavigationMenuList>
        </NavigationMenu>
    </header>
</template>

<script lang="ts" setup>
import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu';
import NavModeToggle from '@/components/NavModeToggle.vue';
</script>