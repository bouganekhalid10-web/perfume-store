"use client";
import { useEffect, useRef, useState } from "react";
type IconName = "arrow" | "bag" | "search" | "heart" | "close" | "plus" | "minus" | "menu" | "leaf" | "spark" | "box";
function Icon({ name, size = 20 }: {
    name: IconName;
    size?: number;
}) {
    const paths: Record<IconName, React.ReactNode> = {
        arrow: <path d="M4 12h15M13 5l7 7-7 7"/>,
        bag: <><path d="M5 7h14l1 14H4L5 7Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></>,
        search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
        heart: <path d="M20.5 4.8a5.2 5.2 0 0 0-7.4 0L12 6l-1.1-1.2a5.2 5.2 0 0 0-7.4 7.4L12 21l8.5-8.8a5.2 5.2 0 0 0 0-7.4Z"/>,
        close: <path d="m6 6 12 12M6 18 18 6"/>,
        plus: <path d="M5 12h14M12 5v14"/>,
        minus: <path d="M5 12h14"/>,
        menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
        leaf: <><path d="M20 3C8 2 2 9 5 16c7 5 15-2 15-13Z"/><path d="m4 21 11-12"/></>,
        spark: <path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Z"/>,
        box: <><path d="m3 7 9-4 9 4v11l-9 4-9-4V7Z"/><path d="m3 7 9 4 9-4M12 11v11M7 5l10 4"/></>,
    };
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
const products = [
    { id: "oud", name: "Oud Royal", family: "Boisé", category: "Mixte", notes: "Oud · Safran · Bois de santal", price: 850, color: "sand", badge: "LA SIGNATURE", description: "Un voyage au cœur des bois précieux. Le safran ouvre la danse, avant de laisser place à un oud enveloppant et à la douceur du santal.", top: "Safran", middle: "Oud", base: "Bois de santal" },
    { id: "rose", name: "Rose Élégance", family: "Floral", category: "Femme", notes: "Rose · Pivoine · Musc blanc", price: 620, color: "rose", badge: "DÉLICAT & LUMINEUX", description: "La fraîcheur d’un bouquet à peine cueilli. Une rose délicate rencontre la pivoine et se prolonge dans un nuage de musc blanc.", top: "Pivoine", middle: "Rose", base: "Musc blanc" },
    { id: "amber", name: "Ambre Solaire", family: "Ambré", category: "Mixte", notes: "Bergamote · Ambre · Vanille", price: 720, color: "amber", badge: "LE COUP DE CŒUR", description: "La chaleur d’une fin d’après-midi, capturée dans un flacon. La bergamote illumine un cœur ambré et un fond de vanille tout en douceur.", top: "Bergamote", middle: "Ambre", base: "Vanille" },
    { id: "nuit", name: "Nuit Boisée", family: "Boisé", category: "Homme", notes: "Poivre noir · Cèdre · Vétiver", price: 790, color: "green", badge: "INTENSE & SINGULIER", description: "Un caractère affirmé, une élégance discrète. Le poivre noir réveille le cèdre, tandis que le vétiver dessine un sillage profond.", top: "Poivre noir", middle: "Cèdre", base: "Vétiver" },
];
type Product = typeof products[number];
type CartItem = {
    id: string;
    size: number;
    quantity: number;
};
type Panel = "cart" | "search" | "product" | "info" | null;
const money = (amount: number) => `${new Intl.NumberFormat("fr-MA").format(amount)} DH`;
const priceFor = (product: Product, size: number) => size === 50 ? Math.round(product.price * 0.65) : product.price;
function ProductPhoto({ product }: {
    product: Product;
}) {
    return <div className={`product-photo ${product.color}`} role="img" aria-label={`Flacon ${product.name}`} style={{ backgroundPosition: `${products.findIndex((p) => p.id === product.id) * 100 / 3}% center` }}/>;
}
export default function Home() {
    const [category, setCategory] = useState("Tous");
    const [family, setFamily] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [panel, setPanel] = useState<Panel>(null);
    const [selected, setSelected] = useState<Product>(products[0]);
    const [size, setSize] = useState(100);
    const [menuOpen, setMenuOpen] = useState(false);
    const [toast, setToast] = useState("");
    const dialogRef = useRef<HTMLDialogElement>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        try {
            const savedCart = JSON.parse(localStorage.getItem("essence-cart") || "[]");
            const savedFavorites = JSON.parse(localStorage.getItem("essence-favorites") || "[]");
            if (Array.isArray(savedCart))
                setCart(savedCart.filter((item: CartItem) => products.some((p) => p.id === item?.id) && [50, 100].includes(item?.size) && Number.isInteger(item?.quantity) && item.quantity > 0 && item.quantity <= 20));
            if (Array.isArray(savedFavorites))
                setFavorites(savedFavorites.filter((id: string) => products.some((p) => p.id === id)));
        }
        catch { /* Shopping still works if browser storage is unavailable. */ }
        setLoaded(true);
    }, []);
    useEffect(() => {
        if (!loaded)
            return;
        try {
            localStorage.setItem("essence-cart", JSON.stringify(cart));
            localStorage.setItem("essence-favorites", JSON.stringify(favorites));
        }
        catch { /* Keep selections in memory. */ }
    }, [cart, favorites, loaded]);
    useEffect(() => {
        if (panel) {
            dialogRef.current?.showModal();
            document.body.style.overflow = "hidden";
        }
        else {
            dialogRef.current?.close();
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [panel]);
    useEffect(() => () => { if (toastTimer.current)
        clearTimeout(toastTimer.current); }, []);
    function notify(message: string) {
        setToast(message);
        if (toastTimer.current)
            clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(""), 3500);
    }
    function addToCart(product: Product, volume = 100) {
        const existing = cart.find((item) => item.id === product.id && item.size === volume);
        if (existing && existing.quantity >= 20) {
            notify("Maximum de 20 flacons par format.");
            return;
        }
        setCart((previous) => {
            const found = previous.find((item) => item.id === product.id && item.size === volume);
            return found ? previous.map((item) => item === found ? { ...item, quantity: Math.min(20, item.quantity + 1) } : item) : [...previous, { id: product.id, size: volume, quantity: 1 }];
        });
        notify(`${product.name} ajouté à votre panier`);
    }
    function toggleFavorite(id: string) { setFavorites((previous) => previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]); }
    function browse(nextCategory = "Tous", nextFamily: string | null = null) { setCategory(nextCategory); setFamily(nextFamily); setOnlyFavorites(false); setMenuOpen(false); }
    function openProduct(product: Product) { setSelected(product); setSize(100); setPanel("product"); }
    function updateQuantity(index: number, delta: number) { setCart((previous) => previous.map((item, i) => i === index ? { ...item, quantity: Math.min(20, item.quantity + delta) } : item).filter((item) => item.quantity > 0)); }
    function downloadSelection() {
        const text = ["ESSENCE — Ma sélection", "Catalogue de démonstration — aucun paiement ni commande transmis.", "", ...cart.map((item) => { const product = products.find((p) => p.id === item.id)!; return `${product.name} · ${item.size} ml × ${item.quantity} — ${money(priceFor(product, item.size) * item.quantity)}`; }), "", `Total indicatif : ${money(total)}`, "Livraison et disponibilité à confirmer avec la boutique."].join("\n");
        const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "ma-selection-essence.txt";
        link.click();
        URL.revokeObjectURL(url);
        notify("Votre sélection a été téléchargée.");
    }
    const total = cart.reduce((sum, item) => sum + priceFor(products.find((p) => p.id === item.id)!, item.size) * item.quantity, 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const visibleProducts = products.filter((product) => (category === "Tous" || product.category === category) && (!family || product.family === family) && (!onlyFavorites || favorites.includes(product.id)));
    const searchResults = products.filter((product) => `${product.name} ${product.notes} ${product.family} ${product.category}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()));
    return <>
    <a href="#collection" className="skip-link">Aller à la collection</a>
    <div className="announcement">L’art du parfum. L’émotion d’une signature.<span>Une invitation à se découvrir <span aria-hidden="true">↗</span></span></div>
    <header className="site-header">
      <a className="wordmark" href="#" aria-label="ESSENCE, accueil">ESSENCE<span>LA PARFUMERIE SINGULIÈRE</span></a>
      <nav className="desktop-nav" aria-label="Navigation principale"><a href="#collection" onClick={() => browse()}>Nos parfums</a><a href="#collection" onClick={() => browse("Femme")}>Pour elle</a><a href="#collection" onClick={() => browse("Homme")}>Pour lui</a><a href="#maison">La maison</a></nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="Rechercher un parfum" onClick={() => { setQuery(""); setPanel("search"); }}><Icon name="search"/></button>
        <button className={`icon-button favorites-button ${onlyFavorites ? "is-favorite" : ""}`} aria-label={`Voir mes favoris (${favorites.length})`} onClick={() => { setOnlyFavorites(!onlyFavorites); setCategory("Tous"); setFamily(null); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }}><Icon name="heart"/></button>
        <button className="icon-button cart-button" aria-label={`Ouvrir mon panier, ${count} articles`} onClick={() => setPanel("cart")}><Icon name="bag"/><span className="cart-count">{count}</span></button>
        <button className="icon-button mobile-menu-button" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"}/></button>
      </div>
    </header>
    {menuOpen && <nav className="mobile-nav" aria-label="Navigation mobile"><a href="#collection" onClick={() => browse()}>Nos parfums</a><a href="#collection" onClick={() => browse("Femme")}>Pour elle</a><a href="#collection" onClick={() => browse("Homme")}>Pour lui</a><a href="#maison" onClick={() => setMenuOpen(false)}>La maison</a></nav>}
    <main>
      <section className="hero" aria-labelledby="hero-title"><div className="hero-copy"><p className="eyebrow"><span className="small-line"/>LA BEAUTÉ DE L’INVISIBLE</p><h1 id="hero-title">Plus qu’un parfum.<br />Une <em>empreinte.</em></h1><p className="hero-description">Il y a des parfums que l’on porte.<br />Et ceux qui racontent qui l’on est.<br />Trouvez votre signature, laissez une émotion.</p><a className="button primary" href="#collection" onClick={() => browse()}>Découvrir la collection<Icon name="arrow" size={18}/></a><div className="hero-footnote"><span className="little-flower" aria-hidden="true">✳</span><span>Des notes précieuses.<br /><strong>Une allure qui n’appartient qu’à vous.</strong></span></div></div><div className="hero-visual"><div className="hero-image" role="img" aria-label="Parfum Oud Royal ESSENCE sur une pierre claire, baigné de soleil et accompagné d’une branche d’olivier"/><div className="image-caption"><span>01 / L’ESSENTIEL</span><span>Oud Royal · Eau de parfum</span></div><span className="vertical-caption">UNE ÉMOTION, À FLEUR DE PEAU.</span><button className="hero-product-link" onClick={() => openProduct(products[0])}><span>Rencontrez Oud Royal</span><Icon name="arrow" size={18}/></button></div></section>
      <div className="values-strip"><div><Icon name="leaf"/><span>Des notes qui ont une âme</span></div><span className="strip-star" aria-hidden="true">✧</span><div><Icon name="spark"/><span>À chaque personnalité, sa signature</span></div><span className="strip-star" aria-hidden="true">✧</span><div><Icon name="box"/><span>Le plaisir d’offrir, ou de s’offrir</span></div></div>
      <section id="collection" className="collection section-shell" aria-labelledby="collection-title">
        <div className="section-heading"><div><p className="eyebrow">LE DÉBUT D’UNE RENCONTRE</p><h2 id="collection-title">Trouvez votre <em>essence.</em></h2></div><p>Quatre univers. Mille façons d’être vous.<br />Laissez vos sens choisir.</p></div>
        <div className="collection-toolbar"><div className="tabs" role="group" aria-label="Filtrer les parfums">{["Tous", "Femme", "Homme", "Mixte"].map((item) => <button key={item} aria-pressed={category === item && !onlyFavorites} className={category === item && !onlyFavorites ? "active" : ""} onClick={() => { setCategory(item); setOnlyFavorites(false); setFamily(null); }}>{item === "Tous" ? "Tous les parfums" : item === "Femme" ? "Pour elle" : item === "Homme" ? "Pour lui" : "Les mixtes"}</button>)}</div><span className="result-count">{visibleProducts.length} parfum{visibleProducts.length !== 1 ? "s" : ""}</span></div>
        {(onlyFavorites || family) && <div className="active-filter">{onlyFavorites ? "Mes favoris" : `Notes ${family === "Boisé" ? "boisées" : family === "Floral" ? "florales" : "ambrées"}`}<button onClick={() => { setOnlyFavorites(false); setFamily(null); }} aria-label="Effacer le filtre"><Icon name="close" size={14}/></button></div>}
        <div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image-wrap"><button className="product-photo-button" onClick={() => openProduct(product)} aria-label={`Découvrir ${product.name}`}><ProductPhoto product={product}/></button><span className="product-badge">{product.badge}</span><button className={`favorite-toggle ${favorites.includes(product.id) ? "is-favorite" : ""}`} aria-pressed={favorites.includes(product.id)} aria-label={`${favorites.includes(product.id) ? "Retirer" : "Ajouter"} ${product.name} ${favorites.includes(product.id) ? "des" : "aux"} favoris`} onClick={() => toggleFavorite(product.id)}><Icon name="heart" size={18}/></button><button className="quick-add" onClick={() => addToCart(product)}>Ajouter au panier<Icon name="plus" size={17}/></button></div><div className="product-type">EAU DE PARFUM<span>100 ML</span></div><div className="product-title-row"><button onClick={() => openProduct(product)}><h3>{product.name}</h3></button><span>{money(product.price)}</span></div><p className="product-notes">{product.notes}</p></article>)}</div>
        {visibleProducts.length === 0 && <div className="empty-state"><Icon name="heart" size={32}/><h3>Votre prochaine rencontre vous attend.</h3><p>Ajoutez un parfum à vos favoris pour le retrouver ici.</p><button className="text-link" onClick={() => { setOnlyFavorites(false); setFamily(null); setCategory("Tous"); }}>Explorer les parfums<Icon name="arrow" size={17}/></button></div>}
        <p className="catalog-note">Collection illustrative · Les compositions et les prix présentés sont des exemples.</p>
      </section>
      <section id="maison" className="maison section-shell" aria-labelledby="maison-title"><div className="maison-art"><div className="maison-art-image"/><span className="art-tag">ESSENCE<br /><small>LE SENS DU DÉTAIL</small></span></div><div className="maison-copy"><p className="eyebrow">L’ESPRIT DE LA MAISON</p><h2 id="maison-title">L’invisible laisse<br />les plus belles <em>traces.</em></h2><p>Un souvenir, un lieu, une personne. Il suffit parfois d’une note pour faire ressurgir tout un monde.</p><p>ESSENCE est une invitation à explorer ce lien intime entre parfum et émotion. Des univers olfactifs singuliers, à découvrir au rythme de vos envies.</p><a href="#guide" className="text-link">Suivez votre intuition<Icon name="arrow" size={18}/></a></div></section>
      <section className="scent-guide section-shell" id="guide" aria-labelledby="guide-title"><div className="guide-intro"><p className="eyebrow">À CHAQUE ENVIE, UNE NOTE</p><h2 id="guide-title">Quel est votre <em>univers ?</em></h2><p>Une première piste pour trouver le parfum qui vous ressemble.</p></div><div className="scent-grid">{[{ family: "Floral", number: "01", title: "La douceur florale", text: "Des pétales délicats, une fraîcheur lumineuse.", icon: "✳" }, { family: "Boisé", number: "02", title: "Le caractère boisé", text: "Des bois profonds, une présence singulière.", icon: "❋" }, { family: "Ambré", number: "03", title: "La chaleur ambrée", text: "Des notes enveloppantes, un éclat solaire.", icon: "☼" }].map((item) => <a href="#collection" className="scent-card" key={item.family} onClick={() => browse("Tous", item.family)}><div className="scent-card-top"><span>{item.number} / {item.family.toUpperCase()}</span><span className="scent-symbol" aria-hidden="true">{item.icon}</span></div><h3>{item.title}</h3><p>{item.text}</p><span className="scent-explore">Explorer<Icon name="arrow" size={18}/></span></a>)}</div></section>
      <section className="faq section-shell" id="questions"><div><p className="eyebrow">QUELQUES NOTES UTILES</p><h2>Le parfum,<br /><em>simplement.</em></h2></div><div className="faq-list"><details><summary>Comment choisir mon parfum ?<span>+</span></summary><p>Commencez par une famille que vous aimez : florale, boisée ou ambrée. Découvrez les notes de chaque parfum, puis essayez-le sur votre peau si vous en avez l’occasion. Laissez-lui le temps d’évoluer avant de choisir.</p></details><details><summary>Quelle différence entre les notes ?<span>+</span></summary><p>Les notes de tête donnent la première impression. Les notes de cœur dessinent le caractère du parfum. Les notes de fond se révèlent ensuite et prolongent son sillage.</p></details><details><summary>Comment conserver mon parfum ?<span>+</span></summary><p>Conservez votre flacon bien fermé, à l’abri de la lumière directe, de la chaleur et de l’humidité. Un placard dans une pièce tempérée est idéal.</p></details><details><summary>Comment passer une commande ?<span>+</span></summary><p>Cette boutique est une démonstration. Vous pouvez composer votre panier et télécharger votre sélection. Les commandes, le paiement et la livraison seront disponibles après la configuration de la boutique.</p></details></div></section>
    </main>
    <footer className="footer"><div className="footer-top"><a href="#" className="wordmark footer-brand">ESSENCE<span>LE PARFUM DE VOTRE SINGULARITÉ.</span></a><p>Votre parfum.<br /><em>Votre histoire.</em></p><div><a href="#collection" onClick={() => browse()}>La collection</a><a href="#maison">La maison</a><a href="#questions">Questions fréquentes</a></div></div><div className="footer-bottom"><span>© 2026 ESSENCE. Tous droits réservés.</span><span>Imaginé pour éveiller les sens.</span><button onClick={() => setPanel("info")}>À propos de cette boutique <span aria-hidden="true">↗</span></button></div></footer>
    <dialog ref={dialogRef} className={`shop-dialog ${panel === "cart" ? "cart-dialog" : ""}`} aria-labelledby="dialog-title" onCancel={() => setPanel(null)} onClick={(event) => { if (event.target === event.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)
            setPanel(null);
    } }}>
      <button className="dialog-close icon-button" aria-label="Fermer" onClick={() => setPanel(null)}><Icon name="close"/></button>
      {toast && <p className="dialog-notice" role="status">{toast}</p>}
      {panel === "product" && <div className="product-detail"><ProductPhoto product={selected}/><div className="detail-copy"><p className="eyebrow">{selected.family.toUpperCase()} · {selected.category.toUpperCase()}</p><h2 id="dialog-title">{selected.name}</h2><p className="detail-description">{selected.description}</p><div className="note-pyramid"><div><small>TÊTE</small><span>{selected.top}</span></div><div><small>CŒUR</small><span>{selected.middle}</span></div><div><small>FOND</small><span>{selected.base}</span></div></div><p className="size-label">Eau de parfum · Choisissez votre format</p><div className="size-options">{[50, 100].map((volume) => <button key={volume} aria-pressed={size === volume} className={size === volume ? "selected" : ""} onClick={() => setSize(volume)}>{volume} ml</button>)}</div><button className="button primary full-width" onClick={() => addToCart(selected, size)}>Ajouter au panier — {money(priceFor(selected, size))}<Icon name="plus" size={18}/></button><p className="demo-note">Parfum et prix illustratifs. Aucune commande réelle.</p></div></div>}
      {panel === "search" && <div className="search-panel"><p className="eyebrow">SUIVEZ UNE NOTE</p><h2 id="dialog-title">Une envie particulière ?</h2><label className="search-input"><Icon name="search"/><input autoFocus type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Un parfum, une note, un univers…" aria-label="Rechercher par nom ou note"/></label><p className="search-label">{query ? `${searchResults.length} résultat${searchResults.length !== 1 ? "s" : ""}` : "DÉCOUVREZ LA COLLECTION"}</p><div className="search-results">{searchResults.map((product) => <button key={product.id} onClick={() => openProduct(product)}><ProductPhoto product={product}/><span><strong>{product.name}</strong><small>{product.notes}</small></span><span>{money(product.price)}<Icon name="arrow" size={16}/></span></button>)}</div>{searchResults.length === 0 && <p className="no-results">Aucun parfum trouvé. Essayez « rose », « oud » ou « boisé ».</p>}</div>}
      {panel === "cart" && <div className="cart-panel"><p className="eyebrow">VOS BELLES RENCONTRES</p><h2 id="dialog-title">Mon panier <span>({count})</span></h2>{cart.length ? <><div className="cart-items">{cart.map((item, index) => { const product = products.find((p) => p.id === item.id)!; return <div className="cart-item" key={`${item.id}-${item.size}`}><ProductPhoto product={product}/><div className="cart-item-info"><h3>{product.name}</h3><p>Eau de parfum · {item.size} ml</p><div className="quantity-control"><button aria-label={`Diminuer la quantité de ${product.name}`} onClick={() => updateQuantity(index, -1)}><Icon name="minus" size={14}/></button><span>{item.quantity}</span><button disabled={item.quantity >= 20} aria-label={`Augmenter la quantité de ${product.name}`} onClick={() => updateQuantity(index, 1)}><Icon name="plus" size={14}/></button></div></div><div className="cart-item-end"><strong>{money(priceFor(product, item.size) * item.quantity)}</strong><button onClick={() => setCart((previous) => previous.filter((_, i) => i !== index))} aria-label={`Retirer ${product.name} du panier`}>Retirer</button></div></div>; })}</div><div className="cart-summary"><div><span>Total indicatif</span><strong>{money(total)}</strong></div><p>Catalogue de démonstration. Le paiement et la livraison ne sont pas encore configurés.</p><button className="button primary full-width" onClick={downloadSelection}>Télécharger ma sélection<Icon name="arrow" size={18}/></button><button className="continue-shopping" onClick={() => { setPanel(null); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }}>Continuer à découvrir</button></div></> : <div className="empty-state"><Icon name="bag" size={38}/><h3>Tout commence par une note.</h3><p>Votre panier attend votre première découverte.</p><button className="button primary" onClick={() => { setPanel(null); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }}>Explorer la collection<Icon name="arrow" size={18}/></button></div>}</div>}
      {panel === "info" && <div className="info-panel"><p className="eyebrow">UNE PREMIÈRE ESQUISSE</p><h2 id="dialog-title">Bienvenue chez ESSENCE.</h2><p>Cette version présente un catalogue illustratif. Les noms, compositions, formats, prix et visuels servent à découvrir l’expérience de la boutique.</p><p>Votre panier et vos favoris sont conservés uniquement dans votre navigateur. Aucune donnée n’est transmise et aucun paiement n’est effectué.</p><p>Les coordonnées de la boutique, le catalogue réel, les conditions de vente et les services de commande seront ajoutés avant l’ouverture commerciale.</p><button className="button primary" onClick={() => setPanel(null)}>Poursuivre la découverte<Icon name="arrow" size={18}/></button></div>}
    </dialog>
    <div className={`toast ${toast && !panel ? "visible" : ""}`} role="status" aria-live="polite" aria-hidden={!!panel}><Icon name="bag" size={18}/>{!panel && toast}</div>
  </>;
}
