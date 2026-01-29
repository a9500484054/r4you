<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
  >
    <rect width="24" height="24" rx="12" fill="#7065EF"/>
    <rect width="24" height="24" rx="12" fill="url(#paint0_radial_159_546)"/>
    <rect width="24" height="24" rx="12" fill="url(#paint1_radial_159_546)"/>
    <rect width="24" height="24" rx="12" fill="url(#paint2_radial_159_546)"/>
    <rect width="24" height="24" rx="12" fill="url(#paint3_radial_159_546)"/>
    <rect
      x="1.2"
      y="1.2"
      width="21.6"
      height="21.6"
      rx="10.8"
      stroke="white"
      :stroke-opacity="strokeOpacity"
      stroke-width="2.4"
    />
    <path
      d="M11.6582 6.2959C11.7783 5.9722 12.2362 5.97232 12.3564 6.2959C13.2743 8.77637 15.2305 10.7325 17.7109 11.6504C18.0352 11.7704 18.0351 12.2286 17.7109 12.3486C15.2304 13.2665 13.2743 15.2226 12.3564 17.7031C12.2364 18.0273 11.7782 18.0274 11.6582 17.7031C10.7403 15.2227 8.78419 13.2665 6.30371 12.3486C5.98014 12.2284 5.98001 11.7705 6.30371 11.6504C8.78423 10.7325 10.7403 8.77641 11.6582 6.2959Z"
      fill="white"
      :fill-opacity="fillOpacity"
      stroke="white"
      stroke-width="2.4"
    />
    <defs>
      <radialGradient id="paint0_radial_159_546" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(22.4211 3.47368) rotate(137.099) scale(42.6783 26.1296)">
        <stop stop-color="#3221F3"/>
        <stop offset="0.44252" stop-color="#3221F3" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="paint1_radial_159_546" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(19.5789 21.4737) rotate(-140.812) scale(37.4833 22.949)">
        <stop stop-color="#20E4FF"/>
        <stop offset="0.44252" stop-color="#20E4FF" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="paint2_radial_159_546" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.947368 17.0526) rotate(-173.157) scale(31.8055 19.4728)">
        <stop stop-color="#ED20FF"/>
        <stop offset="0.44252" stop-color="#ED20FF" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="paint3_radial_159_546" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6.94737 5.05263) rotate(-120.444) scale(41.7571 25.5656)">
        <stop stop-color="#20E4FF"/>
        <stop offset="0.44252" stop-color="#20E4FF" stop-opacity="0"/>
      </radialGradient>
    </defs>
  </svg>
</template>

<script lang="ts">
export default {
  name: 'CustomIcon',
  props: {
    size: {
      type: [Number, String],
      default: 24
    },
    className: {
      type: String,
      default: ''
    },
    strokeOpacity: {
      type: [Number, String],
      default: 0.3
    },
    fillOpacity: {
      type: [Number, String],
      default: 0.8
    }
  }
}
</script>
