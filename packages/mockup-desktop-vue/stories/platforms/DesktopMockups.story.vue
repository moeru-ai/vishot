<script setup lang="ts">
import { ScenarioCanvas } from '../../src'
import { MacosPlatformRoot } from '../../src/platforms/macos'
import { WindowRoot } from '../../src/platforms/macos/containers/window'
import { WindowsPlatformRoot } from '../../src/platforms/windows'
</script>

<template>
  <Story title="Platforms/Desktop Mockups" group="platforms">
    <Variant title="macOS">
      <div :class="['h-screen w-screen overflow-hidden bg-neutral-950']">
        <ScenarioCanvas :width="1920" :height="1080">
          <MacosPlatformRoot>
            <template #windows>
              <WindowRoot :style="{ left: '360px', top: '180px', width: '720px', height: '440px' }">
                <div :class="['h-full w-full bg-white p-8 text-neutral-900']">
                  <div :class="['text-3xl font-600']">
                    Vishot
                  </div>
                  <div :class="['mt-4 text-lg text-neutral-500']">
                    Compose product screenshots inside reusable desktop mockups.
                  </div>
                </div>
              </WindowRoot>
            </template>
          </MacosPlatformRoot>
        </ScenarioCanvas>
      </div>
    </Variant>

    <Variant title="Windows">
      <div :class="['h-screen w-screen overflow-hidden bg-neutral-950']">
        <ScenarioCanvas :width="1920" :height="1080">
          <WindowsPlatformRoot />
        </ScenarioCanvas>
      </div>
    </Variant>
  </Story>
</template>
