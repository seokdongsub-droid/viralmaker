with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

ids_in_app = [
  'toast-msg', 'product-link', 'product-memo', 'product-media-file',
  'upload-box', 'upload-preview', 'upload-prompt', 'btn-generate-all',
  'copy-textarea', 'char-counter', 'channel-info-text', 'btn-copy-text',
  'btn-regen-channel', 'cardnews-canvas', 'canvas-wrapper', 'btn-lang-ko',
  'btn-lang-ja', 'btn-prev-slide', 'btn-next-slide', 'slide-indicator-text',
  'slide-edit-badge', 'slide-edit-title', 'slide-edit-subtitle',
  'btn-download-slide', 'btn-download-all', 'btn-mobile-save',
  'insta-sim-image', 'insta-sim-caption', 'modal-mobile-save',
  'modal-save-image', 'btn-close-modal', 'modal-qr', 'btn-open-qr-modal',
  'btn-close-qr-modal', 'modal-api-key', 'input-gemini-key', 'btn-open-api-modal',
  'btn-save-api-key', 'btn-close-api-modal'
]

for el_id in ids_in_app:
    if f'id="{el_id}"' not in html and f"id='{el_id}'" not in html:
        print(f'MISSING ID: {el_id}')
print('ID check complete.')
