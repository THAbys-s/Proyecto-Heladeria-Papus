# import time
# from playwright.sync_api import sync_playwright

# def approve_paypal_approve_url(approve_url, buyer_email, buyer_password, headless=True):
#     """Automatiza la aprobación de órdenes de PayPal Sandbox usando Playwright."""

#     with sync_playwright() as p:
#         browser = p.chromium.launch(headless=headless, slow_mo=150)
#         context = browser.new_context()
#         page = context.new_page()

#         print(f"[DEBUG] Abriendo URL de aprobación: {approve_url}")
#         page.goto(approve_url, wait_until="domcontentloaded", timeout=60000)

#         # Esperar campo de login
#         if page.is_visible("input#email", timeout=15000):
#             print("[DEBUG] Iniciando sesión en PayPal Sandbox...")
#             page.fill("input#email", buyer_email)
#             page.click("button#btnNext")
#             page.wait_for_selector("input#password", timeout=15000)
#             page.fill("input#password", buyer_password)
#             page.click("button#btnLogin")

#         # Esperar redirección al checkout
#         page.wait_for_load_state("networkidle", timeout=30000)

#         # Buscar el botón "Continuar y revisar pedido"
#         print("[DEBUG] Buscando botón 'Continuar y revisar pedido'...")
#         try:
#             page.wait_for_selector("button:has-text('Continuar y revisar pedido')", timeout=30000)
#             page.click("button:has-text('Continuar y revisar pedido')")
#             print("[DEBUG] Botón clickeado con éxito.")
#         except Exception:
#             print("[WARN] No se encontró el botón 'Continuar y revisar pedido'. Probando alternativa...")
#             buttons = page.locator("button")
#             for i in range(buttons.count()):
#                 txt = buttons.nth(i).inner_text().strip().lower()
#                 if "continuar" in txt or "revisar" in txt:
#                     buttons.nth(i).click()
#                     print(f"[DEBUG] Clic en botón alternativo: {txt}")
#                     break

#         # Esperar confirmación o redirección
#         time.sleep(5)
#         page.wait_for_load_state("networkidle", timeout=30000)
#         print("[DEBUG] Aprobación completada o redirección detectada.")

#         context.close()
#         browser.close()
