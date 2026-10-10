<script setup lang="ts">
import type { GridStack, GridStackNode } from 'gridstack'

const api = useApi()
const store = useDataStore()

interface WidgetItem {
  id: string
  title: string
  description: string
  category: 'stat' | 'chart' | 'action'
  w: number
  h: number
  minW: number
  minH: number
  x: number
  y: number
  visible: boolean
}

const defaultWidgets: WidgetItem[] = [
  {
    id: 'stat_total',
    title: 'Total Pelanggaran',
    description: 'Statistik jumlah total kasus dan akumulasi bobot poin pelanggaran.',
    category: 'stat',
    w: 3,
    h: 2,
    minW: 2,
    minH: 2,
    x: 0,
    y: 0,
    visible: true,
  },
  {
    id: 'stat_selesai',
    title: 'Sanksi Selesai',
    description: 'Jumlah sanksi yang telah tuntas dibina oleh guru BK / wali kelas.',
    category: 'stat',
    w: 3,
    h: 2,
    minW: 2,
    minH: 2,
    x: 3,
    y: 0,
    visible: true,
  },
  {
    id: 'stat_proses',
    title: 'Dalam Pembinaan BK',
    description: 'Kasus pelanggaran yang sedang dalam masa konseling aktif.',
    category: 'stat',
    w: 3,
    h: 2,
    minW: 2,
    minH: 2,
    x: 6,
    y: 0,
    visible: true,
  },
  {
    id: 'stat_pending',
    title: 'Kasus Baru (Pending)',
    description: 'Kasus baru dilaporkan yang memerlukan tindakan segera.',
    category: 'stat',
    w: 3,
    h: 2,
    minW: 2,
    minH: 2,
    x: 9,
    y: 0,
    visible: true,
  },
  {
    id: 'chart_weekly',
    title: 'Tren Pelanggaran Mingguan',
    description: 'Grafik kapsul frekuensi kasus per hari selama 7 hari terakhir.',
    category: 'chart',
    w: 4,
    h: 4,
    minW: 3,
    minH: 3,
    x: 0,
    y: 2,
    visible: true,
  },
  {
    id: 'card_agenda',
    title: 'Agenda Konseling BK',
    description: 'Rekomendasi pemanggilan orang tua dan bimbingan kasus mendesak.',
    category: 'action',
    w: 4,
    h: 4,
    minW: 3,
    minH: 3,
    x: 4,
    y: 2,
    visible: true,
  },
  {
    id: 'card_kategori',
    title: 'Distribusi Kategori Pelanggaran',
    description: 'Rekapitulasi kasus berdasarkan klasifikasi tata tertib sekolah.',
    category: 'chart',
    w: 4,
    h: 4,
    minW: 3,
    minH: 3,
    x: 8,
    y: 2,
    visible: true,
  },
  {
    id: 'card_top_students',
    title: 'Siswa Akumulasi Poin Tertinggi',
    description: 'Peringkat siswa dengan akumulasi poin tertinggi dan status SP.',
    category: 'action',
    w: 7,
    h: 4,
    minW: 4,
    minH: 3,
    x: 0,
    y: 6,
    visible: true,
  },
  {
    id: 'gauge_progress',
    title: 'Tingkat Penyelesaian Sanksi',
    description: 'Meteran circular arc progres penanganan sanksi kedisiplinan.',
    category: 'chart',
    w: 5,
    h: 4,
    minW: 3,
    minH: 3,
    x: 7,
    y: 6,
    visible: true,
  },
]

const widgets = ref<WidgetItem[]>(JSON.parse(JSON.stringify(defaultWidgets)))
const gridContainer = ref<HTMLElement | null>(null)
let grid: GridStack | null = null

// UI States
const isMenuWidgetOpen = ref(false)
const isEditMode = ref(false)
const widgetSearch = ref('')

// Computed metrics for stats
const totalPelanggaran = computed(() => store.pelanggaranSiswas.value.length)
const totalPoin = computed(() => {
  return store.pelanggaranSiswas.value.reduce((sum, p) => sum + (Number(p.point) || 0), 0)
})
const totalSelesai = computed(
  () => store.pelanggaranSiswas.value.filter((p) => p.status_sanksi === 'Selesai').length
)
const totalProses = computed(
  () => store.pelanggaranSiswas.value.filter((p) => p.status_sanksi === 'Dalam Proses').length
)
const totalPending = computed(
  () => store.pelanggaranSiswas.value.filter((p) => p.status_sanksi === 'Pending').length
)
const progressPercentage = computed(() => {
  if (totalPelanggaran.value === 0) return 0
  return Math.round((totalSelesai.value / totalPelanggaran.value) * 100)
})

const visibleWidgets = computed(() => widgets.value.filter((w) => w.visible))
const hiddenWidgetsCount = computed(() => widgets.value.filter((w) => !w.visible).length)

const filteredDrawerWidgets = computed(() => {
  if (!widgetSearch.value) return widgets.value
  const q = widgetSearch.value.toLowerCase()
  return widgets.value.filter((w) => w.title.toLowerCase().includes(q) || w.description.toLowerCase().includes(q))
})

// Load saved layout from localStorage
const loadSavedLayout = () => {
  if (import.meta.client) {
    try {
      const saved = localStorage.getItem('sikap_dashboard_layout_v3')
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<WidgetItem>[]
        widgets.value = defaultWidgets.map((def) => {
          const found = parsed.find((p) => p.id === def.id)
          if (found) {
            return {
              ...def,
              x: found.x !== undefined ? found.x : def.x,
              y: found.y !== undefined ? found.y : def.y,
              w: found.w !== undefined ? found.w : def.w,
              h: found.h !== undefined ? found.h : def.h,
              visible: found.visible !== undefined ? found.visible : def.visible,
            }
          }
          return def
        })
      }
    } catch (e) {
      console.warn('Failed to parse saved layout', e)
    }
  }
}

// Save layout to localStorage
const saveLayout = () => {
  if (import.meta.client && grid) {
    // Only persist in 12-column mode to prevent mobile view from overwriting desktop coordinates
    if (grid.getColumn() !== 12) return
    try {
      const saveNodes = grid.save(false) as GridStackNode[]
      if (Array.isArray(saveNodes)) {
        saveNodes.forEach((node) => {
          const w = widgets.value.find((item) => item.id === node.id)
          if (w) {
            if (node.x !== undefined) w.x = node.x
            if (node.y !== undefined) w.y = node.y
            if (node.w !== undefined) w.w = node.w
            if (node.h !== undefined) w.h = node.h
          }
        })
      }
      localStorage.setItem('sikap_dashboard_layout_v3', JSON.stringify(widgets.value))
    } catch (e) {
      console.warn('Failed to save layout', e)
    }
  }
}

// Synchronize coordinates from GridStack engine nodes into reactive widgets state
const syncLayoutFromGrid = () => {
  if (!grid) return
  const nodes = grid.engine.nodes
  nodes.forEach((node) => {
    const id = node.el?.getAttribute('gs-id') || (node as any).id
    if (id) {
      const item = widgets.value.find((w) => w.id === id)
      if (item) {
        if (node.x !== undefined) item.x = node.x
        if (node.y !== undefined) item.y = node.y
        if (node.w !== undefined) item.w = node.w
        if (node.h !== undefined) item.h = node.h
      }
    }
  })
}

// Initialize GridStack
const initGrid = async () => {
  if (!import.meta.client || !gridContainer.value) return

  const { GridStack } = await import('gridstack')

  if (grid) {
    grid.destroy(false)
  }

  grid = GridStack.init(
    {
      column: 12,
      columnOpts: {
        breakpointForWindow: true,
        breakpoints: [
          { w: 768, c: 1 },
          { w: 1024, c: 6 },
          { w: 1280, c: 12 },
        ],
      },
      cellHeight: 96,
      margin: 12,
      animate: true,
      float: false,
      handle: '.grid-drag-handle',
      resizable: {
        handles: 'e, se, s, sw, w',
      },
      acceptWidgets: true,
    },
    gridContainer.value
  )

  // Apply initial locked state (default: terkunci)
  grid.enableMove(isEditMode.value)
  grid.enableResize(isEditMode.value)

  // Track pre-drag positions for responsive card-swapping
  let draggingOrigin: { id: string; x: number; y: number; w: number; h: number } | null = null
  let preDragLayout: { id: string; x: number; y: number; w: number; h: number }[] = []

  grid.on('dragstart', (event: any, el: HTMLElement) => {
    const node = (el as any).gridstackNode
    const id = el.getAttribute('gs-id')
    if (node && id) {
      draggingOrigin = {
        id,
        x: node.x,
        y: node.y,
        w: node.w,
        h: node.h,
      }
      // Save snapshot of all visible widgets before displacement
      preDragLayout = widgets.value
        .filter((w) => w.visible)
        .map((w) => ({ id: w.id, x: w.x, y: w.y, w: w.w, h: w.h }))
    }
  })

  grid.on('dragstop', (event: any, el: HTMLElement) => {
    if (!draggingOrigin || !grid) return

    const node = (el as any).gridstackNode
    const id = el.getAttribute('gs-id')
    if (!node || !id) {
      draggingOrigin = null
      return
    }

    const newX = node.x
    const newY = node.y
    const origX = draggingOrigin.x
    const origY = draggingOrigin.y

    // If card moved to a new slot
    if (newX !== origX || newY !== origY) {
      // Find which widget was originally at the landing spot
      let maxOverlap = 0
      let targetWidget: { id: string; x: number; y: number; w: number; h: number } | null = null

      for (const item of preDragLayout) {
        if (item.id === id) continue
        const overlapX = Math.max(0, Math.min(newX + node.w, item.x + item.w) - Math.max(newX, item.x))
        const overlapY = Math.max(0, Math.min(newY + node.h, item.y + item.h) - Math.max(newY, item.y))
        const area = overlapX * overlapY
        if (area > maxOverlap) {
          maxOverlap = area
          targetWidget = item
        }
      }

      if (targetWidget && maxOverlap > 0) {
        // Swap positions of dragged widget and target widget
        const targetEl = document.querySelector(`[gs-id="${targetWidget.id}"]`) as HTMLElement
        if (targetEl) {
          grid.batchUpdate()

          // Reset any other bystander widgets that shifted during drag
          preDragLayout.forEach((orig) => {
            if (orig.id !== id && orig.id !== targetWidget.id) {
              const otherEl = document.querySelector(`[gs-id="${orig.id}"]`) as HTMLElement
              if (otherEl) {
                grid.update(otherEl, { x: orig.x, y: orig.y })
                const wObj = widgets.value.find((w) => w.id === orig.id)
                if (wObj) {
                  wObj.x = orig.x
                  wObj.y = orig.y
                }
              }
            }
          })

          const colLimit = grid.getColumn()
          const safeTargetX = Math.min(origX, Math.max(0, colLimit - targetWidget.w))
          const safeDraggedX = Math.min(targetWidget.x, Math.max(0, colLimit - node.w))

          // Move target widget into dragged widget's origin
          grid.update(targetEl, { x: safeTargetX, y: origY })
          // Move dragged widget into target widget's origin
          grid.update(el, { x: safeDraggedX, y: targetWidget.y })

          // Update reactive state
          const wDragged = widgets.value.find((w) => w.id === id)
          const wTarget = widgets.value.find((w) => w.id === targetWidget.id)
          if (wDragged) {
            wDragged.x = safeDraggedX
            wDragged.y = targetWidget.y
          }
          if (wTarget) {
            wTarget.x = safeTargetX
            wTarget.y = origY
          }
        }
      } else {
        const wDragged = widgets.value.find((w) => w.id === id)
        if (wDragged) {
          wDragged.x = newX
          wDragged.y = newY
        }
      }
    }

    draggingOrigin = null
    saveLayout()
  })

  // Listen to change and save layout
  grid.on('change', () => {
    syncLayoutFromGrid()
    saveLayout()
  })

  // Listen to dropped external widgets
  grid.on('added', (event: any, items: any[]) => {
    if (Array.isArray(items)) {
      items.forEach((item) => {
        const id = item.el?.getAttribute('gs-id')
        if (id) {
          const w = widgets.value.find((itemW) => itemW.id === id)
          if (w) {
            w.visible = true
            w.x = item.x ?? w.x
            w.y = item.y ?? w.y
            w.w = item.w ?? w.w
            w.h = item.h ?? w.h
          }
        }
      })
      grid?.compact()
      syncLayoutFromGrid()
      saveLayout()
    }
  })

  // Setup drag in from widget drawer
  setupDragInItems()
}

const setupDragInItems = async () => {
  if (!import.meta.client) return
  const { GridStack } = await import('gridstack')
  try {
    GridStack.setupDragIn('.menu-widget-draggable', {
      appendTo: 'body',
      helper: 'clone',
    })
  } catch (e) {
    console.warn('GridStack.setupDragIn error', e)
  }
}

// Hide a widget and automatically adapt/compact remaining cards upwards
const hideWidget = async (id: string) => {
  const w = widgets.value.find((item) => item.id === id)
  if (w && grid) {
    w.visible = false
    const el = document.querySelector(`[gs-id="${id}"]`)
    if (el) {
      grid.removeWidget(el as HTMLElement, false)
      // Automatically compact remaining widgets up so lower cards adapt their positions
      grid.compact()
      syncLayoutFromGrid()
      await nextTick()
      saveLayout()
    }
  }
}

// Show a widget and compact layout
const showWidget = async (id: string) => {
  const w = widgets.value.find((item) => item.id === id)
  if (w && grid) {
    w.visible = true
    await nextTick()
    const el = document.querySelector(`[gs-id="${id}"]`)
    if (el) {
      grid.makeWidget(el as HTMLElement)
      grid.compact()
      syncLayoutFromGrid()
      await nextTick()
      saveLayout()
    }
  }
}

// Reset layout to default
const resetLayout = async () => {
  if (confirm('Kembalikan tata letak dashboard ke posisi default?')) {
    localStorage.removeItem('sikap_dashboard_layout_v3')
    widgets.value = JSON.parse(JSON.stringify(defaultWidgets))
    await nextTick()
    await initGrid()
  }
}

// Toggle edit mode
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
  if (grid) {
    grid.enableMove(isEditMode.value)
    grid.enableResize(isEditMode.value)
  }
}

onMounted(async () => {
  loadSavedLayout()
  await Promise.allSettled([
    api.getSiswa(),
    api.getPelanggaranSiswa(),
    api.getKelas(),
    api.getPelanggaran(),
    api.getKategori(),
  ])
  await nextTick()
  await initGrid()
})

onUnmounted(() => {
  if (grid) {
    grid.destroy(false)
  }
})
</script>

<template>
  <div class="space-y-6 select-none relative">
    <!-- Top Action Bar (Donezo Header with GridStack Controls) -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard Kedisiplinan Siswa
          </h1>
        </div>
        <p class="text-sm text-gray-500 mt-1 font-normal">
          Sesuaikan tata letak dashboard Anda dengan drag & drop, sembunyikan atau tambahkan widget.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Edit Mode Toggle -->
        <button
          type="button"
          @click="toggleEditMode"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all shadow-2xs active:scale-95"
          :class="[
            isEditMode
              ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-300/40'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
          ]"
          :title="isEditMode ? 'Kunci tata letak agar posisi tidak bergeser' : 'Buka mode edit untuk mengatur posisi & swap card'"
        >
          <AppIcon :name="isEditMode ? 'unlock' : 'lock'" size="14" :class="isEditMode ? 'text-amber-700' : 'text-gray-500'" />
          <span>{{ isEditMode ? 'Mode Edit (Drag Aktif)' : 'Tata Letak Terkunci' }}</span>
        </button>

        <!-- Menu Widget Drawer Button -->
        <button
          type="button"
          @click="isMenuWidgetOpen = true"
          class="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-gray-50 border border-gray-200/90 text-xs font-semibold text-gray-800 shadow-2xs hover:shadow-xs transition-all active:scale-95"
        >
          <AppIcon name="dashboard" size="14" class="text-[#164E3D]" />
          <span>Atur Menu Widget</span>
          <span
            v-if="hiddenWidgetsCount > 0"
            class="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold font-mono"
            :title="`${hiddenWidgetsCount} widget disembunyikan`"
          >
            {{ hiddenWidgetsCount }}
          </span>
        </button>

        <!-- Reset Layout Button -->
        <button
          type="button"
          @click="resetLayout"
          class="w-9 h-9 rounded-full bg-white border border-gray-200/90 text-gray-600 hover:text-gray-900 flex items-center justify-center hover:bg-gray-50 shadow-2xs transition-colors"
          title="Reset tata letak ke posisi default"
        >
          <AppIcon name="refresh" size="14" />
        </button>

        <!-- Catat Pelanggaran Button -->
        <NuxtLink
          to="/pelanggaran-siswa"
          class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#164E3D] hover:bg-[#113D2F] text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <AppIcon name="plus" size="14" />
          <span>+ Catat Pelanggaran</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Edit Mode Active Notification Banner -->
    <div
      v-if="isEditMode"
      class="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300/80 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs transition-all"
    >
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-full bg-amber-200/90 text-amber-900 flex items-center justify-center shrink-0">
          <AppIcon name="unlock" size="14" />
        </div>
        <div>
          <span class="font-bold">Mode Edit Aktif:</span>
          <span class="text-amber-800 ml-1">
            Geser card ke atas card lain untuk bertukar posisi secara otomatis tanpa meninggalkan rongga kosong.
          </span>
        </div>
      </div>
      <button
        type="button"
        @click="toggleEditMode"
        class="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-900 hover:bg-amber-950 text-white font-semibold shrink-0 transition-colors cursor-pointer active:scale-95"
      >
        <AppIcon name="lock" size="12" />
        <span>Kunci Tata Letak</span>
      </button>
    </div>

    <!-- THE GRIDSTACK CONTAINER -->
    <div
      class="grid-stack w-full transition-all"
      :class="{
        'grid-stack-locked': !isEditMode,
        'grid-stack-editing': isEditMode,
      }"
      ref="gridContainer"
    >
      <!-- 1. Stat Total Pelanggaran -->
      <div
        v-if="widgets.find((w) => w.id === 'stat_total')?.visible"
        class="grid-stack-item"
        gs-id="stat_total"
        :gs-x="widgets.find((w) => w.id === 'stat_total')?.x"
        :gs-y="widgets.find((w) => w.id === 'stat_total')?.y"
        :gs-w="widgets.find((w) => w.id === 'stat_total')?.w"
        :gs-h="widgets.find((w) => w.id === 'stat_total')?.h"
        gs-min-w="2"
        gs-min-h="2"
      >
        <div class="grid-stack-item-content group/item relative">
          <!-- Edit Mode Control Bar -->
          <div
            v-if="isEditMode"
            class="absolute top-3 right-3 z-30 flex items-center gap-1 opacity-85 group-hover/item:opacity-100 transition-opacity bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 text-white text-xs shadow-sm"
          >
            <span class="grid-drag-handle cursor-grab active:cursor-grabbing p-1 hover:text-emerald-300" title="Geser ke card lain untuk bertukar posisi">
              <AppIcon name="grip" size="13" />
            </span>
            <button type="button" @click="hideWidget('stat_total')" class="p-1 hover:text-rose-400" title="Sembunyikan">
              <AppIcon name="x" size="12" />
            </button>
          </div>
          <StatCard
            title="Total Pelanggaran"
            :value="totalPelanggaran"
            :trend-text="`+${totalPoin} Poin Akumulasi`"
            is-highlight
            to="/pelanggaran-siswa"
          />
        </div>
      </div>

      <!-- 2. Stat Sanksi Selesai -->
      <div
        v-if="widgets.find((w) => w.id === 'stat_selesai')?.visible"
        class="grid-stack-item"
        gs-id="stat_selesai"
        :gs-x="widgets.find((w) => w.id === 'stat_selesai')?.x"
        :gs-y="widgets.find((w) => w.id === 'stat_selesai')?.y"
        :gs-w="widgets.find((w) => w.id === 'stat_selesai')?.w"
        :gs-h="widgets.find((w) => w.id === 'stat_selesai')?.h"
        gs-min-w="2"
        gs-min-h="2"
      >
        <div class="grid-stack-item-content group/item relative">
          <div
            v-if="isEditMode"
            class="absolute top-3 right-3 z-30 flex items-center gap-1 opacity-85 group-hover/item:opacity-100 transition-opacity bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-gray-200 text-gray-700 text-xs shadow-2xs"
          >
            <span class="grid-drag-handle cursor-grab active:cursor-grabbing p-1 hover:text-gray-900" title="Geser ke card lain untuk bertukar posisi">
              <AppIcon name="grip" size="13" />
            </span>
            <button type="button" @click="hideWidget('stat_selesai')" class="p-1 hover:text-rose-600" title="Sembunyikan">
              <AppIcon name="x" size="12" />
            </button>
          </div>
          <StatCard
            title="Sanksi Selesai"
            :value="totalSelesai"
            :trend-text="`${progressPercentage}% Tuntas Dibina`"
            to="/pelanggaran-siswa"
          />
        </div>
      </div>

      <!-- 3. Stat Dalam Pembinaan BK -->
      <div
        v-if="widgets.find((w) => w.id === 'stat_proses')?.visible"
        class="grid-stack-item"
        gs-id="stat_proses"
        :gs-x="widgets.find((w) => w.id === 'stat_proses')?.x"
        :gs-y="widgets.find((w) => w.id === 'stat_proses')?.y"
        :gs-w="widgets.find((w) => w.id === 'stat_proses')?.w"
        :gs-h="widgets.find((w) => w.id === 'stat_proses')?.h"
        gs-min-w="2"
        gs-min-h="2"
      >
        <div class="grid-stack-item-content group/item relative">
          <div
            v-if="isEditMode"
            class="absolute top-3 right-3 z-30 flex items-center gap-1 opacity-85 group-hover/item:opacity-100 transition-opacity bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-gray-200 text-gray-700 text-xs shadow-2xs"
          >
            <span class="grid-drag-handle cursor-grab active:cursor-grabbing p-1 hover:text-gray-900" title="Geser ke card lain untuk bertukar posisi">
              <AppIcon name="grip" size="13" />
            </span>
            <button type="button" @click="hideWidget('stat_proses')" class="p-1 hover:text-rose-600" title="Sembunyikan">
              <AppIcon name="x" size="12" />
            </button>
          </div>
          <StatCard
            title="Dalam Pembinaan BK"
            :value="totalProses"
            trend-text="Sedang Konseling"
            to="/pelanggaran-siswa"
          />
        </div>
      </div>

      <!-- 4. Stat Kasus Baru / Pending -->
      <div
        v-if="widgets.find((w) => w.id === 'stat_pending')?.visible"
        class="grid-stack-item"
        gs-id="stat_pending"
        :gs-x="widgets.find((w) => w.id === 'stat_pending')?.x"
        :gs-y="widgets.find((w) => w.id === 'stat_pending')?.y"
        :gs-w="widgets.find((w) => w.id === 'stat_pending')?.w"
        :gs-h="widgets.find((w) => w.id === 'stat_pending')?.h"
        gs-min-w="2"
        gs-min-h="2"
      >
        <div class="grid-stack-item-content group/item relative">
          <div
            v-if="isEditMode"
            class="absolute top-3 right-3 z-30 flex items-center gap-1 opacity-85 group-hover/item:opacity-100 transition-opacity bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-gray-200 text-gray-700 text-xs shadow-2xs"
          >
            <span class="grid-drag-handle cursor-grab active:cursor-grabbing p-1 hover:text-gray-900" title="Geser ke card lain untuk bertukar posisi">
              <AppIcon name="grip" size="13" />
            </span>
            <button type="button" @click="hideWidget('stat_pending')" class="p-1 hover:text-rose-600" title="Sembunyikan">
              <AppIcon name="x" size="12" />
            </button>
          </div>
          <StatCard
            title="Kasus Baru (Pending)"
            :value="totalPending"
            trend-text="Perlu Tindakan Segera"
            trend-type="warning"
            to="/pelanggaran-siswa"
          />
        </div>
      </div>

      <!-- 5. Chart Tren Mingguan -->
      <div
        v-if="widgets.find((w) => w.id === 'chart_weekly')?.visible"
        class="grid-stack-item"
        gs-id="chart_weekly"
        :gs-x="widgets.find((w) => w.id === 'chart_weekly')?.x"
        :gs-y="widgets.find((w) => w.id === 'chart_weekly')?.y"
        :gs-w="widgets.find((w) => w.id === 'chart_weekly')?.w"
        :gs-h="widgets.find((w) => w.id === 'chart_weekly')?.h"
        gs-min-w="3"
        gs-min-h="3"
      >
        <div class="grid-stack-item-content group/item relative">
          <div
            v-if="isEditMode"
            class="absolute top-3 right-3 z-30 flex items-center gap-1 opacity-85 group-hover/item:opacity-100 transition-opacity bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-gray-200 text-gray-700 text-xs shadow-2xs"
          >
            <span class="grid-drag-handle cursor-grab active:cursor-grabbing p-1 hover:text-gray-900" title="Geser ke card lain untuk bertukar posisi">
              <AppIcon name="grip" size="13" />
            </span>
            <button type="button" @click="hideWidget('chart_weekly')" class="p-1 hover:text-rose-600" title="Sembunyikan">
              <AppIcon name="x" size="12" />
            </button>
          </div>
          <WeeklyViolationChart />
        </div>
      </div>

      <!-- 6. Card Agenda Konseling BK -->
      <div
        v-if="widgets.find((w) => w.id === 'card_agenda')?.visible"
        class="grid-stack-item"
        gs-id="card_agenda"
        :gs-x="widgets.find((w) => w.id === 'card_agenda')?.x"
        :gs-y="widgets.find((w) => w.id === 'card_agenda')?.y"
        :gs-w="widgets.find((w) => w.id === 'card_agenda')?.w"
        :gs-h="widgets.find((w) => w.id === 'card_agenda')?.h"
        gs-min-w="3"
        gs-min-h="3"
      >
        <div class="grid-stack-item-content group/item relative">
          <div
            v-if="isEditMode"
            class="absolute top-3 right-3 z-30 flex items-center gap-1 opacity-85 group-hover/item:opacity-100 transition-opacity bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-gray-200 text-gray-700 text-xs shadow-2xs"
          >
            <span class="grid-drag-handle cursor-grab active:cursor-grabbing p-1 hover:text-gray-900" title="Geser ke card lain untuk bertukar posisi">
              <AppIcon name="grip" size="13" />
            </span>
            <button type="button" @click="hideWidget('card_agenda')" class="p-1 hover:text-rose-600" title="Sembunyikan">
              <AppIcon name="x" size="12" />
            </button>
          </div>
          <CounselingAgendaCard />
        </div>
      </div>

      <!-- 7. Card Kategori Pelanggaran -->
      <div
        v-if="widgets.find((w) => w.id === 'card_kategori')?.visible"
        class="grid-stack-item"
        gs-id="card_kategori"
        :gs-x="widgets.find((w) => w.id === 'card_kategori')?.x"
        :gs-y="widgets.find((w) => w.id === 'card_kategori')?.y"
        :gs-w="widgets.find((w) => w.id === 'card_kategori')?.w"
        :gs-h="widgets.find((w) => w.id === 'card_kategori')?.h"
        gs-min-w="3"
        gs-min-h="3"
      >
        <div class="grid-stack-item-content group/item relative">
          <div
            v-if="isEditMode"
            class="absolute top-3 right-3 z-30 flex items-center gap-1 opacity-85 group-hover/item:opacity-100 transition-opacity bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-gray-200 text-gray-700 text-xs shadow-2xs"
          >
            <span class="grid-drag-handle cursor-grab active:cursor-grabbing p-1 hover:text-gray-900" title="Geser ke card lain untuk bertukar posisi">
              <AppIcon name="grip" size="13" />
            </span>
            <button type="button" @click="hideWidget('card_kategori')" class="p-1 hover:text-rose-600" title="Sembunyikan">
              <AppIcon name="x" size="12" />
            </button>
          </div>
          <CategoryDistributionCard />
        </div>
      </div>

      <!-- 8. Card Siswa Poin Tertinggi -->
      <div
        v-if="widgets.find((w) => w.id === 'card_top_students')?.visible"
        class="grid-stack-item"
        gs-id="card_top_students"
        :gs-x="widgets.find((w) => w.id === 'card_top_students')?.x"
        :gs-y="widgets.find((w) => w.id === 'card_top_students')?.y"
        :gs-w="widgets.find((w) => w.id === 'card_top_students')?.w"
        :gs-h="widgets.find((w) => w.id === 'card_top_students')?.h"
        gs-min-w="3"
        gs-min-h="3"
      >
        <div class="grid-stack-item-content group/item relative">
          <div
            v-if="isEditMode"
            class="absolute top-3 right-3 z-30 flex items-center gap-1 opacity-85 group-hover/item:opacity-100 transition-opacity bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-gray-200 text-gray-700 text-xs shadow-2xs"
          >
            <span class="grid-drag-handle cursor-grab active:cursor-grabbing p-1 hover:text-gray-900" title="Geser ke card lain untuk bertukar posisi">
              <AppIcon name="grip" size="13" />
            </span>
            <button type="button" @click="hideWidget('card_top_students')" class="p-1 hover:text-rose-600" title="Sembunyikan">
              <AppIcon name="x" size="12" />
            </button>
          </div>
          <TopStudentsCard />
        </div>
      </div>

      <!-- 9. Gauge Tingkat Penyelesaian Sanksi -->
      <div
        v-if="widgets.find((w) => w.id === 'gauge_progress')?.visible"
        class="grid-stack-item"
        gs-id="gauge_progress"
        :gs-x="widgets.find((w) => w.id === 'gauge_progress')?.x"
        :gs-y="widgets.find((w) => w.id === 'gauge_progress')?.y"
        :gs-w="widgets.find((w) => w.id === 'gauge_progress')?.w"
        :gs-h="widgets.find((w) => w.id === 'gauge_progress')?.h"
        gs-min-w="2"
        gs-min-h="3"
      >
        <div class="grid-stack-item-content group/item relative">
          <div
            v-if="isEditMode"
            class="absolute top-3 right-3 z-30 flex items-center gap-1 opacity-85 group-hover/item:opacity-100 transition-opacity bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-gray-200 text-gray-700 text-xs shadow-2xs"
          >
            <span class="grid-drag-handle cursor-grab active:cursor-grabbing p-1 hover:text-gray-900" title="Geser ke card lain untuk bertukar posisi">
              <AppIcon name="grip" size="13" />
            </span>
            <button type="button" @click="hideWidget('gauge_progress')" class="p-1 hover:text-rose-600" title="Sembunyikan">
              <AppIcon name="x" size="12" />
            </button>
          </div>
          <ProgressArcGauge
            :percentage="progressPercentage"
            title="Tingkat Penyelesaian Sanksi"
            subtitle="Sanksi Tertangani"
            :count-selesai="totalSelesai"
            :count-proses="totalProses"
            :count-pending="totalPending"
          />
        </div>
      </div>
    </div>

    <!-- Empty Grid Notice (if all widgets hidden) -->
    <div
      v-if="visibleWidgets.length === 0"
      class="p-12 text-center rounded-3xl bg-white border border-gray-200/80 shadow-sm space-y-4 my-8"
    >
      <div class="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
        <AppIcon name="dashboard" size="24" />
      </div>
      <div>
        <h3 class="text-base font-bold text-gray-900">
          Semua Widget Sedang Disembunyikan
        </h3>
        <p class="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          Buka Menu Widget di pojok kanan atas untuk menambahkan widget kembali ke dashboard Anda.
        </p>
      </div>
      <button
        type="button"
        @click="isMenuWidgetOpen = true"
        class="px-5 py-2.5 rounded-full bg-[#164E3D] hover:bg-[#113D2F] text-white text-xs font-semibold shadow-sm"
      >
        Buka Menu Widget
      </button>
    </div>

    <!-- SLIDEOVER DRAWER: MENU WIDGET (DRAG & DROP KATALOG) -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMenuWidgetOpen"
        class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end"
        @click="isMenuWidgetOpen = false"
      >
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div
            v-if="isMenuWidgetOpen"
            class="w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between p-6 select-none overflow-y-auto"
            @click.stop
          >
            <!-- Drawer Header -->
            <div>
              <div class="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-lg font-bold text-gray-900">
                      Katalog Menu Widget
                    </h3>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#164E3D]/10 text-[#164E3D]">
                      {{ visibleWidgets.length }}/{{ widgets.length }} Aktif
                    </span>
                  </div>
                  <p class="text-xs text-gray-400 mt-0.5">
                    Drag item ke dashboard atau klik tambah untuk mengaktifkan.
                  </p>
                </div>
                <button
                  type="button"
                  @click="isMenuWidgetOpen = false"
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
                >
                  <AppIcon name="x" size="16" />
                </button>
              </div>

              <!-- Search filter input -->
              <div class="my-4 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <AppIcon name="search" size="15" />
                </div>
                <input
                  v-model="widgetSearch"
                  type="text"
                  placeholder="Cari widget..."
                  class="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8F9FA] border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#164E3D]"
                />
              </div>

              <!-- Quick Helper Bar -->
              <div class="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-[#164E3D] mb-4 flex items-center gap-2">
                <AppIcon name="check" size="15" class="shrink-0" />
                <span>Setiap widget dapat di-resize dan dipindah posisinya bebas di dashboard.</span>
              </div>

              <!-- Widgets List -->
              <div class="space-y-3">
                <div
                  v-for="w in filteredDrawerWidgets"
                  :key="w.id"
                  class="menu-widget-draggable p-4 rounded-2xl border transition-all duration-200"
                  :class="[
                    w.visible
                      ? 'bg-gray-50/70 border-gray-200 opacity-90'
                      : 'bg-white border-emerald-300 shadow-2xs hover:shadow-md cursor-grab active:cursor-grabbing hover:border-[#164E3D]',
                  ]"
                  :gs-id="w.id"
                  :gs-w="w.w"
                  :gs-h="w.h"
                  :gs-min-w="w.minW"
                  :gs-min-h="w.minH"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <h4 class="text-xs font-bold text-gray-900 truncate">
                          {{ w.title }}
                        </h4>
                        <span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gray-200 text-gray-600">
                          {{ w.w }}x{{ w.h }}
                        </span>
                      </div>
                      <p class="text-[11px] text-gray-500 mt-1 leading-snug">
                        {{ w.description }}
                      </p>
                    </div>

                    <!-- Action Toggle Button -->
                    <div class="shrink-0">
                      <button
                        v-if="w.visible"
                        type="button"
                        @click="hideWidget(w.id)"
                        class="px-2.5 py-1 rounded-full border border-gray-200 hover:border-red-300 text-[10px] font-semibold text-gray-600 hover:text-red-600 transition-colors"
                      >
                        Sembunyikan
                      </button>
                      <button
                        v-else
                        type="button"
                        @click="showWidget(w.id)"
                        class="px-3 py-1 rounded-full bg-[#164E3D] hover:bg-[#113D2F] text-white text-[10px] font-semibold transition-all shadow-2xs active:scale-95"
                      >
                        + Tambahkan
                      </button>
                    </div>
                  </div>

                  <!-- Drag Hint Footer -->
                  <div class="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                    <span class="flex items-center gap-1">
                      <AppIcon name="menu" size="12" />
                      {{ w.visible ? 'Sedang aktif di dashboard' : 'Tarik (Drag) ke Dashboard' }}
                    </span>
                    <span
                      class="font-semibold"
                      :class="w.visible ? 'text-emerald-700' : 'text-gray-400'"
                    >
                      ● {{ w.visible ? 'Aktif' : 'Disembunyikan' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Drawer Footer Actions -->
            <div class="pt-6 border-t border-gray-100 space-y-2 mt-6">
              <button
                type="button"
                @click="resetLayout"
                class="w-full py-2.5 px-4 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
              >
                Reset Tata Letak Default
              </button>
              <button
                type="button"
                @click="isMenuWidgetOpen = false"
                class="w-full py-2.5 px-4 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-semibold transition-colors"
              >
                Selesai & Simpan
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>
