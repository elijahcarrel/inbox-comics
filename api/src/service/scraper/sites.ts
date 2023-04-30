import { ArcamaxScraper } from "./scrapers/arcamax";
import { ComicsKingdomScraper } from "./scrapers/comics-kingdom";
import { DinosaurScraper } from "./scrapers/dinosaur";
import { ExplosmScraper } from "./scrapers/explosm";
import { GoComicsScraper } from "./scrapers/gocomics";
import { PhdComicsScraper } from "./scrapers/phd-comics";
import { Scraper } from "./scraper";
import { SmbcScraper } from "./scrapers/smbc";
import { ThreeWordPhraseScraper } from "./scrapers/three-word-phrase";
import { TundraScraper } from "./scrapers/tundra";
import { XkcdScraper } from "./scrapers/xkcd";

type Site = {
    name: string;
    description: string;
    id: number;
    scraper: Scraper;
}

export const sites: Record<number, Site> = {
    0: {
        name: "GOCOMICS",
        description: "GoComics",
        id: 0,
        scraper: new GoComicsScraper(),
    },
    1: {
        name: "COMICS_KINGDOM",
        description: "Comics Kingdom",
        id: 1,
        scraper: new ComicsKingdomScraper(),
    },
    2: {
        name: "ARCAMAX",
        description: "ArcaMax",
        id: 2,
        scraper: new ArcamaxScraper("thefunnies"),
    },
    3: {
        name: "Tundra",
        description: "Tundra",
        id: 3,
        scraper: new TundraScraper(),
    },
    4: {
        name: "XKCD",
        description: "xkcd",
        id: 4,
        scraper: new XkcdScraper(),
    },
    5: {
        name: "PHDCOMICS",
        description: "PhD Comics",
        id: 5,
        scraper: new PhdComicsScraper(),
    },
    6: {
        name: "EXPLOSM",
        description: "Explosm",
        id: 6,
        scraper: new ExplosmScraper(),
    },
    7: {
        name: "ARCAMAX_EDITORIALS",
        description: "ArcaMax Editorials",
        id: 7,
        scraper: new ArcamaxScraper("politics/editorialcartoons"),
    },
    8: {
        name: "DINOSAUR",
        description: "Dinosaur",
        id: 8,
        scraper: new DinosaurScraper(),
    },
    // TODO(ecarrel): delete SMBC? It's unnecessary since we already get it from gocomics.
    9: {
        name: "SMBC",
        description: "Saturday Morning Breakfast Cereal",
        id: 9,
        scraper: new SmbcScraper(),
    },
    10: {
        name: "THREE_WORD_PHRASE",
        description: "Three Word Phrase",
        id: 10,
        scraper: new ThreeWordPhraseScraper(),
    },
};

