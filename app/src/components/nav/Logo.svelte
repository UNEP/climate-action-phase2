<script>
	import UNEPLogoBlue from 'src/components/assets/unep50.svg';
	import UNEPLogoWhite from 'src/components/assets/unep50white.svg';
  export let color;
</script>

<div class="logo">
	<img src={!color || color === 'blue' ? UNEPLogoBlue : UNEPLogoWhite} alt='Logo of the United Nations Environment Programme | 50 year anniversary'>
</div>