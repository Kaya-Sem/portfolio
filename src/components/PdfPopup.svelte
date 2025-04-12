<script>
  export let pdfPath = '';
  export let onClose = () => {};
</script>

<div class="popup-overlay" on:click={onClose}>
  <div class="popup-content" on:click|stopPropagation>
    <button class="close-button" on:click={onClose}>×</button>
    <iframe src={pdfPath} title="PDF Viewer"></iframe>
  </div>
</div>

<style>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  }

  .popup-content {
    position: relative;
    width: 50%;
    height: 90%;
    background: white;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  .close-button {
    position: absolute;
    top: -40px;
    right: -40px;
    width: 36px;
    height: 36px;
    border: none;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .close-button:hover {
    background: grey;
  }
</style> 