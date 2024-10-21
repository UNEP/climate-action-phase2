<script>
  import Donuts from "./charts/Donuts.svelte";
  export let selectedData;
  export let selectedContinent;
  export let currency;

  // console.log(selectedData);
</script>

<div class="af-popup" data-continental={selectedData.region}>
  <div on:click={() => selectedContinent = 0 } class="close">
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M13.0007 14.1795L17.31 18.4892C17.4707 18.6498 17.6651 18.7323 17.8933 18.7365C18.1215 18.7407 18.3203 18.6583 18.4897 18.4892C18.6588 18.3198 18.7433 18.1232 18.7433 17.8992C18.7433 17.6754 18.6588 17.4788 18.4897 17.3095L14.18 13.0002L18.4897 8.69083C18.6503 8.53016 18.7328 8.33572 18.737 8.1075C18.7412 7.87927 18.6588 7.6805 18.4897 7.51116C18.3203 7.34205 18.1237 7.2575 17.8997 7.2575C17.6759 7.2575 17.4793 7.34205 17.31 7.51116L13.0007 11.8208L8.69132 7.51116C8.53065 7.3505 8.33621 7.26805 8.10799 7.26383C7.87976 7.25961 7.68098 7.34205 7.51165 7.51116C7.34254 7.6805 7.25799 7.87716 7.25799 8.10116C7.25799 8.32494 7.34254 8.5215 7.51165 8.69083L11.8213 13.0002L7.51165 17.3095C7.35098 17.4702 7.26854 17.6646 7.26432 17.8928C7.2601 18.1211 7.34254 18.3198 7.51165 18.4892C7.68098 18.6583 7.87765 18.7428 8.10165 18.7428C8.32543 18.7428 8.52198 18.6583 8.69132 18.4892L13.0007 14.1795ZM13.003 25.6668C11.2601 25.6668 9.61932 25.3344 8.08065 24.6695C6.54198 24.0046 5.19876 23.0986 4.05098 21.9515C2.90343 20.8042 1.99698 19.4615 1.33165 17.9235C0.66654 16.3855 0.333984 14.7452 0.333984 13.0025C0.333984 11.2505 0.666429 9.60372 1.33132 8.06216C1.99621 6.52061 2.90221 5.17972 4.04932 4.0395C5.19665 2.89927 6.53932 1.9965 8.07732 1.33116C9.61532 0.666051 11.2557 0.333496 12.9983 0.333496C14.7503 0.333496 16.3971 0.66594 17.9387 1.33083C19.4802 1.99572 20.8211 2.89805 21.9613 4.03783C23.1015 5.17761 24.0043 6.51794 24.6697 8.05883C25.3348 9.59972 25.6673 11.2461 25.6673 12.9978C25.6673 14.7407 25.3349 16.3815 24.67 17.9202C24.0051 19.4588 23.1028 20.8021 21.963 21.9498C20.8232 23.0974 19.4829 24.0038 17.942 24.6692C16.4011 25.3343 14.7548 25.6668 13.003 25.6668Z" fill="#1C1B1F"/>
    </svg>
  </div>
  <p>
    <strong>{selectedData.region}</strong><br /> Annual adaptation finance needs: {`US$${selectedData.usd} billion`}.
  </p>
  <p>Adaptation finance needs by sector:</p>
  <Donuts bind:selectedData />
</div>

<style>
  .af-popup {
    position: absolute;
    border-radius: 4px;
    z-index: 111;
    display: flex;
    width: 286px;
    padding: 14px 16px;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    background: rgba(249, 249, 249, 0.88);
    box-shadow: 0px 4px 18.8px 0px rgba(0, 0, 0, 0.15);
  }

  .af-popup .close {
    position: absolute;
    top: -13px;
    right: -13px;
  }

  .af-popup .close:hover {
    opacity: 0.8;
  }
  @media only screen and (max-width: 900px) {
    .af-popup {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  @media only screen and (min-width: 900px) {
      .af-popup[data-continental='South Asia'] {
        right: 40%;
        top: 5%;
      }
      .af-popup[data-continental='Europe and Central Asia'] {
        right: 42%;
        top: 5%;
      }
      .af-popup[data-continental='Latin America and the Caribbean'] {
        right: 35%;
        top: 5%;
      }
      .af-popup[data-continental='Sub-Saharan Africa'] {
        right: 11%;
        top: 5%;
      }
      .af-popup[data-continental='East Asia and the Pacific'] {
        right: 29%;
        top: 5%;
      }
      .af-popup[data-continental='Middle East and North Africa'] {
        right: 55%;
        top: 5%;
      }
  }
  .af-popup p {
    color: #1E1E1E;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 300;
    line-height: 18px;
    margin-bottom: 0;
    padding-bottom: 0;
    display: block;
    width: 100%;
  }

  .af-popup p strong {
    text-shadow: 4px 0px 3px #F9F9F9, 0px -1px 2.9px #F9F9F9, 0px 4px 7.4px #F9F9F9;
    font-weight: 700;

  }
  

</style>