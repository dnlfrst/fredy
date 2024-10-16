import utils, {buildHash} from '../utils.js';

let appliedBlackList = [];

function normalize(o) {
    const size = o.size.replace("m2", "m²") || 'N/A m²';
    const rooms = o.rooms || 'N/A';
    const price = (o.price || '--- €').replace('Preis auf Anfrage', '--- €');
    const title = o.title || 'N/A';
    const immoId = o.id.substring(o.id.indexOf('-') + 1, o.id.length);
    const link = `https://immo.swp.de/immobilien/${immoId}`;
    const description = o.description;
    const id = buildHash(immoId, price);
    return Object.assign(o, {id, price, size, title, link, description});
}

function applyBlacklist(o) {
    const titleNotBlacklisted = !utils.isOneOf(o.title, appliedBlackList);
    const descNotBlacklisted = !utils.isOneOf(o.description, appliedBlackList);
    return titleNotBlacklisted && descNotBlacklisted;
}

const config = {
    url: null,
    crawlContainer: '.js-serp-item',
    sortByDateParam: 's=most_recently_updated_first',
    crawlFields: {
        id: '.js-bookmark-btn@data-id',
        price: 'div.align-items-start div:first-child | trim',
        rooms: 'div.align-items-start div:nth-child(2) | trim',
        size: 'div.align-items-start div:nth-child(3) | trim',
        title: '.card-body h2 | trim',
        link: '.ci-search-result__link@href',
        description: '.js-show-more-item-sm | removeNewline | trim',
        address: '.card-text | trim'
    },
    paginate: 'li.page-item.pagination__item a.page-link@href',
    normalize: normalize,
    filter: applyBlacklist,
};
export const init = (sourceConfig, blacklist) => {
    config.enabled = sourceConfig.enabled;
    config.url = sourceConfig.url;
    appliedBlackList = blacklist || [];
};
export const metaInformation = {
    name: 'Immo Südwest Presse',
    baseUrl: 'https://immo.swp.de/',
    id: 'immoswp',
};
export {config};
