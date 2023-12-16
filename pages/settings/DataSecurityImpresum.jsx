import React from "react";
import { View, Pressable, StyleSheet, ScrollView, Text } from "react-native";

import * as style from "../../styles";

import { getLangs } from "../../constants/langs";
import { openLink } from "../../constants/index";

import BackHeader from "../../components/BackHeader";

export default function DataSecurityImpresum({ navigation }) {
    const titleStyles = [style.TlgBd, style.tWhite];
    const textStyles = [style.Tmd, style.tWhite, styles.semiSectionContainer];
    const smTextStyles = [
        style.TsmRg,
        style.tWhite,
        { textAlign: "justify" },
        styles.semiSectionContainer,
    ];

    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
            <Pressable style={{ zIndex: 10 }}>
                <BackHeader
                    // title={getLangs("settings_datasecurityimpresum_title")}
                    title={""}
                    onBack={() => navigation.goBack()}
                    showReload={false}
                />
            </Pressable>

            <ScrollView
                style={[style.container, style.pH, style.oVisible]}
                keyboardDismissMode="interactive"
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                snapToAlignment="center"
                snapToEnd>
                <View>
                    <Text style={[style.Ttitle2, style.tWhite]}>
                        {getLangs(
                            "settings_datasecurityimpresum_impresum_title"
                        )}
                    </Text>

                    <Text style={[titleStyles, styles.semiSectionContainer]}>
                        {getLangs("settings_datasecurityimpresum_p5tgm")}
                    </Text>

                    <View style={style.pH}>
                        <Text style={textStyles}>
                            Cyril Mark {"\n"}
                            Hermann-Liebmann-Straße 31{"\n"}
                            04315 Lipsk
                        </Text>
                        <Text style={textStyles}>
                            Korla Baier {"\n"}
                            Srjedźny puć 12 {"\n"}
                            01920 Pančicy Kukow
                        </Text>
                    </View>

                    {/* Ideja a přesadźenje */}
                    <View style={[styles.semiSectionContainer]}>
                        <Text style={titleStyles}>
                            {getLangs("settings_datasecurityimpresum_ideas")}
                        </Text>
                        <View style={style.pH}>
                            <Text style={[textStyles]}>
                                Mark, Cyril;{"\n"}
                                Baier, Korla
                            </Text>
                        </View>
                    </View>

                    {/* Kontakt */}
                    <View style={[styles.semiSectionContainer]}>
                        <Text style={titleStyles}>
                            {getLangs("settings_datasecurityimpresum_contact")}
                        </Text>
                        <View style={style.pH}>
                            <Text style={[textStyles]}>
                                Telefon: +49 179 4361854 {"\n"}
                                Email: kostrjanc@gmail.com {"\n"}
                                Internet: kostrjanc.de
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Rukowanja za wobsah */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.Ttitle2, style.tWhite]}>
                        {getLangs(
                            "settings_datasecurityimpresum_content_title"
                        )}
                    </Text>

                    <Text style={[titleStyles, styles.semiSectionContainer]}>
                        {getLangs("settings_datasecurityimpresum_content_sub")}
                    </Text>
                </View>

                {/* 1 Zakłady */}
                <View style={styles.sectionContainer}>
                    {/* 1 Zakłady */}
                    <View>
                        <Text style={[style.Ttitle2, style.tWhite]}>
                            <Text style={style.tBlue}>1</Text> Zakłady
                        </Text>

                        {/* 1.1 Definicije */}
                        <View>
                            <Text
                                style={[
                                    titleStyles,
                                    styles.semiSectionContainer,
                                ]}>
                                1.1 Definicije
                            </Text>
                            <View style={style.pH}>
                                <Text style={smTextStyles}>
                                    Wužiwar, je wosoba (přirodna abo
                                    juristiska), kotryž kostrjanc wužiwa, abo to
                                    chce. Cyril Mark a Korla Baier (tež „my“,
                                    abo kostrjanc) su wobhospodarjo aplikacije.
                                    Aplikacija (tež platforma, socialna syć, abo
                                    kostrjanc) je program, kotryž je so wot
                                    Cyrila Marka a (nic jenož) Korle Baiera
                                    wuwiła z mjenom kostrjanc (a wšitke
                                    wotwodźenja tutoho mjena)
                                </Text>
                            </View>
                        </View>
                        {/* 1.2 Změny */}
                        <View>
                            <Text
                                style={[
                                    titleStyles,
                                    styles.semiSectionContainer,
                                ]}>
                                1.2 Změny
                            </Text>
                            <View style={style.pH}>
                                <Text style={smTextStyles}>
                                    Wobhospodarjo aplikacije maja prawo tute
                                    wuměnjenja změnić, jeli wužiwar tute
                                    aktualizowane wuměnjenja njeakceptuje, njeje
                                    wužiwane aplikacije wjace móžne.
                                    Wobhospodarjo aplikacije móža w tutym padźe
                                    tež daty wužiwarja wotstronić.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 2 Wuzamknjenje rukowanja */}
                <View style={styles.sectionContainer}>
                    <View>
                        <Text style={[style.Ttitle2, style.tWhite]}>
                            <Text style={style.tBlue}>2</Text> Wuzamknjenje
                            rukowanja
                        </Text>

                        {/* 2.1 Wobsahi */}
                        <View>
                            <Text
                                style={[
                                    titleStyles,
                                    styles.semiSectionContainer,
                                ]}>
                                2.1 Wobsahi
                            </Text>
                            <View style={style.pH}>
                                <Text style={smTextStyles}>
                                    Wotpowědnje § 7 wotr. 1 Zakonja wo tele
                                    słužbach (Teledienstegesetz – TDG) su Cyril
                                    Mark a Korla Baier za swójske wobsahi na
                                    tutych stronach wotpowědnje powšitkownym
                                    zakonjam zamołwići. Po §§ 8 do 10 Zakonja wo
                                    tele słužbach njejsmy pak jako poskićowar
                                    posłužby winowaći, dale date abo składowane
                                    cuze informacije dohladować abo za
                                    wobstejnosćemi slědźić, kotrež na
                                    njezakonske jednanje pokazuja. To njedótka
                                    so zawjazkow k wotstronjenju abo blokowanju
                                    wužiwanja informacijow wotpowědnje
                                    powšitkownym zakonjam. Wotpowědne rukowanje
                                    pak je hakle wot wokomika, hdyž zhonimy wo
                                    konkretnym ranjenju prawa, móžne. Po
                                    wozjewjenju ranjenjow prawow so wotpowědne
                                    wobsahi bjez komdźenja wotstronja. Dale je
                                    kóždy wužiwar za wozjewjene wobsahi sam
                                    zamołwity. My njepřewzamy žanu kontrolu
                                    wozjewjenych wobsahow, hač so wobsah na
                                    regule kostrjanca dźerži (sekcija 4) abo na
                                    płaćiwe abo njepłaćiwe prawo. Jeli wužiwar
                                    wobsahi wozjewi, kotryž płaćiwe abo
                                    njepłaćiwe prawo łamaja, rukuje wužiwar sam
                                    za wuskutki wozjewjenja.
                                </Text>
                            </View>
                        </View>
                        {/* 2.2 Rukowanje za pokazki */}
                        <View>
                            <Text
                                style={[
                                    titleStyles,
                                    styles.semiSectionContainer,
                                ]}>
                                2.2 Rukowanje za pokazki
                            </Text>
                            <View style={style.pH}>
                                <Text style={smTextStyles}>
                                    Naš poskitk wopřija pokazki na eksterne
                                    internetowe strony třećich („linki“), na
                                    kotrychž wobsahi žadyn wliw nimamy. Tohodla
                                    njemóžemy za tute cuze wobsahi tež rukować.
                                    Za wobsahi přez pokazki zwjazanych stronow
                                    je stajnje poskićowar abo wobhospodar tutych
                                    stronow zamołwity. Wobstajna wobsahowa
                                    kontrola zwjazanych stronow njeje pak bjez
                                    konkretneho podhlada zranjenja prawniskich
                                    předpisow přicpěwajomna. Ručež zhonimy wo
                                    ranjenju prawniskich předpisow, so tajke
                                    pokazki bjez komdźenja wotstronja.
                                </Text>
                            </View>
                        </View>
                        {/* 2.3 Wobsahi */}
                        <View>
                            <Text
                                style={[
                                    titleStyles,
                                    styles.semiSectionContainer,
                                ]}>
                                2.3 Wjacerěčnosć wobsahow
                            </Text>
                            <View style={style.pH}>
                                <Text style={smTextStyles}>
                                    Tuta app hodźi so w němskej a hornjoserbskej
                                    rěči wotwołać. Prosymy wo zrozumjenje, zo
                                    njeje móžno, cyłkowny přełožk podatych
                                    wobsahow stajnje aktualnje zaručić. Dale je
                                    kostrjanc primarnje serbska socialna syć.
                                    Tohodla prosymy wo serbsku wobchadnu rěč.
                                    Jeli my měnjenja smy, zo ma wěsty němski
                                    wobsah negatiwny wliw na platformu, móže so
                                    stać, zo tutón wobsah wot platformje
                                    wotstronimy a wužiwar pochłostamy.
                                </Text>
                            </View>
                        </View>
                        {/* 2.4 Awtorske Prawo */}
                        <View>
                            <Text
                                style={[
                                    titleStyles,
                                    styles.semiSectionContainer,
                                ]}>
                                2.4 Awtorske prawo
                            </Text>
                            <View style={style.pH}>
                                <Text style={smTextStyles}>
                                    Wšitke wot wobhospodarja tuteje app
                                    wudźěłane wobsahi a dźěła (teksty a wobrazy)
                                    podleža němskemu awtorskemu prawu. Za
                                    rozmnoženje, wobdźěłanje, rozšěrjenje a
                                    kóždežkuli wužiwanje zwonka hranicow
                                    awtorskeho prawa je trěbna pisomna dowolnosć
                                    awtora. Downloady a kopije tutych wobsahow
                                    su jeničce za priwatne, njekomercielne
                                    wužiwanje dowolene. Dale wobsteji móžnosć za
                                    wužiwarja tuteje aplikacije sam wobsahi
                                    wozjewić. Jeli wužiwar wobsahi wozjewi da
                                    wón wobhospodarjej tuteje aplikacije
                                    awtomatisce licencu za rozmnoženje,
                                    wobdźěłanje, přełožowanje a kóždežkuli
                                    tamneho wužiwanje za sćěhowace:{"\n"}
                                    <Text style={{ textAlign: "left" }}>
                                        1. Wužiwanje wobsahow za wabjenje.{"\n"}
                                        2. Składowanje a wobdźěłanje wobsahow na
                                        systemach kostrjanca, zo bychu so
                                        wotpowědnje wobsahi wšitkim wužiwarjam
                                        kostrjanc dispoziciji stajili.
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        {/* 2.5 Wobsahi */}
                        <View>
                            <Text
                                style={[
                                    titleStyles,
                                    styles.semiSectionContainer,
                                ]}>
                                2.5 Widźomnosć wobsahow
                            </Text>
                            <View style={style.pH}>
                                <Text style={smTextStyles}>
                                    Aplikacija kostrjanc, je socialna syć, to
                                    rěka zo so wšitke wozjewjenje wobsahi kóždym
                                    wužiwarjej kostrjanca pokaza. Jeli to
                                    wužiwar nochce ma móžnosć swoje daty
                                    wotstronić, kaž w sekcije 3.3 wopisane
                                </Text>
                            </View>
                        </View>
                        {/* 2.6 Wobsahi */}
                        <View>
                            <Text
                                style={[
                                    titleStyles,
                                    styles.semiSectionContainer,
                                ]}>
                                2.6 Techniske zmylki
                            </Text>
                            <View style={style.pH}>
                                <Text style={smTextStyles}>
                                    Hačrunjež so kostrjanc regularnje testuja, a
                                    so swědomiće wuwij, móže so stać so dawaja w
                                    aplikaciji techniske zmylki. Jeli techniski
                                    zmylk wužiwanje aplikacije zadźěwa, abo so
                                    myli, njerukuja wobhospodarjo platformy za
                                    tutón zmylk.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 3 Škit datow */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.Ttitle2, style.tWhite]}>
                        <Text style={style.tBlue}>3</Text>{" "}
                        {getLangs(
                            "settings_datasecurityimpresum_datasecurity_title"
                        )}
                    </Text>

                    {/* 3.1 Wužiwanje Google Cloud */}
                    <View>
                        <Text
                            style={[titleStyles, styles.semiSectionContainer]}>
                            3.1 Wužiwanje Google Cloud
                        </Text>
                        <View style={style.pH}>
                            <Text style={smTextStyles}>
                                Zo bychu so słužby kostrjanca za kóždeho
                                wužiwarja k dispoziciji stajić móhli wužiwa
                                kostrjanc Google Cloud Platform. Z wužiwanjom
                                kostrjanca přihłosuje wužiwar awtomatisce zo so
                                jeho daty, kaž na{" "}
                                <Text
                                    style={style.tBlue}
                                    onPress={() =>
                                        openLink(
                                            "https://cloud.google.com/privacy/gdpr"
                                        )
                                    }>
                                    https://cloud.google.com/privacy/gdpr
                                </Text>{" "}
                                wopisane předźěłaja, wužiwaja a składuja.
                            </Text>
                        </View>
                    </View>
                    {/* 3.2 Zhromadźene daty */}
                    <View>
                        <Text
                            style={[titleStyles, styles.semiSectionContainer]}>
                            3.2 Zhromadźene daty
                        </Text>
                        <View style={style.pH}>
                            <Text style={smTextStyles}>
                                Wobhospodarjo aplikacije składuja awtomatisce
                                wšitke daty, kotryž so přez jedne tekstowe polo,
                                knefl abo tamny medij kostrjancej sposrědkuja.
                                Dale składuja so přidatne informacije kaž časowy
                                dypk wěstej akcije, a tamne relewantne daty,
                                kotryž su za wobhospodarjenje aplikaciji trěbne.
                            </Text>
                        </View>
                    </View>
                    {/* 3.3 Wotstronjenje datow */}
                    <View>
                        <Text
                            style={[titleStyles, styles.semiSectionContainer]}>
                            3.1 Wužiwanje Google Cloud
                        </Text>
                        <View style={style.pH}>
                            <Text style={smTextStyles}>
                                Jeli chce wužiwar swoje daty wotstronić, ma
                                wobhospodarjow aplikacije pod{" "}
                                <Text
                                    style={style.tBlue}
                                    onPress={() =>
                                        openLink("mailto:kostrjanc@gmail.com")
                                    }>
                                    kostrjanc@gmail.com
                                </Text>{" "}
                                wo tym informować. Po tym, zo smy naprašowanje
                                dóstali započina proces awtentifikacije, hdyž so
                                naprašowanje werifikuje. Po tym je zo so
                                naprašowanje werifikowało, so wšitke daty
                                wotstronja. Dla wěstych regulacijow dyrbimy
                                wužiwarske daty pod naprašowanju wotstronjenja
                                hišće 3 lět dołho składować.
                            </Text>
                        </View>
                    </View>
                    {/* 3.4 Dohlad do datow */}
                    <View>
                        <Text
                            style={[titleStyles, styles.semiSectionContainer]}>
                            3.4 Dohlad do datow
                        </Text>
                        <View style={style.pH}>
                            <Text style={smTextStyles}>
                                Jeli chce wužiwar wědźeć, kotry daty kostrjanc
                                wo wužiwarju ma, ma wobhospodarjow aplikacije
                                pod{" "}
                                <Text
                                    style={style.tBlue}
                                    onPress={() =>
                                        openLink("mailto:kostrjanc@gmail.com")
                                    }>
                                    kostrjanc@gmail.com
                                </Text>{" "}
                                wo tym informować. Po tym, zo smy naprašowanje
                                dóstali započina proces awtentifikacije, hdyž so
                                naprašowanje werifikuje. Po tym je zo so
                                naprašowanje werifikowało, so wšitke daty
                                wužiwarjej komunikuja.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* 4 Regule kostrjanca */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.Ttitle2, style.tWhite]}>
                        <Text style={style.tBlue}>4</Text> Regule kostrjanca
                    </Text>

                    {/* 4.1 Zakłady */}
                    <View>
                        <Text
                            style={[titleStyles, styles.semiSectionContainer]}>
                            4.1 Zakłady
                        </Text>
                        <View style={style.pH}>
                            <Text style={smTextStyles}>
                                Zhromadna wuměna a socialna interakcija je jenož
                                móžna, hdyž so wužiwarjo na wěste regule dźerža.
                                Tute regule so w tutej sekciji (sekcija 4)
                                wopisaja. Jeli so wužiwar na tute regule
                                njedźerži so wužiwar chłosta. To rěka zo móže so
                                wužiwar z kostrjanca wuzamknyć, abo wotpowědny
                                wobsah(a/i) wotstronja. Interpretacija předleži
                                wobhospodarjam aplikacije. Za zmylki so
                                njerukuje.
                            </Text>
                        </View>
                    </View>
                    {/* 4.2 Regule za wozjewjenje */}
                    <View>
                        <Text
                            style={[titleStyles, styles.semiSectionContainer]}>
                            4.2 Regule za wozjewjenje
                        </Text>
                        <View style={style.pH}>
                            <Text style={smTextStyles}>
                                Tekstowe wobsahi njesmědźa sćěhowace regule
                                łamać:
                            </Text>
                            <View
                                style={[
                                    { marginTop: style.defaultMsm },
                                    style.pH,
                                ]}>
                                <Text style={[style.tWhite, style.Tmd]}>
                                    · wobsah, kotryž płaćiwe prawo łama
                                </Text>
                                <Text style={[style.tWhite, style.Tmd]}>
                                    · žadyn spam
                                </Text>
                                <Text style={[style.tWhite, style.Tmd]}>
                                    · žana nahosć abo seksualne jednanja
                                </Text>
                                <Text style={[style.tWhite, style.Tmd]}>
                                    · žadyn scam abo wobšudźenja
                                </Text>
                                <Text style={[style.tWhite, style.Tmd]}>
                                    · žana marěč abo symbole hidy
                                </Text>
                                <Text style={[style.tWhite, style.Tmd]}>
                                    · žane wopačne informacije
                                </Text>
                                <Text style={[style.tWhite, style.Tmd]}>
                                    · žadyn mobbing abo wobćežowanje
                                </Text>
                                <Text style={[style.tWhite, style.Tmd]}>
                                    · žana namóc abo strašne organizacije
                                </Text>
                                <Text style={[style.tWhite, style.Tmd]}>
                                    · žane přeńdźenje přećiwo prawow na
                                    duchownym swójstwje
                                </Text>
                                <Text style={[style.tWhite, style.Tmd]}>
                                    · žana předań ilegalnych tworow
                                </Text>
                                <Text style={[style.tWhite, style.Tmd]}>
                                    · žadyn suicid abo samo zranjenja
                                </Text>
                                <Text style={[style.tWhite, style.Tmd]}>
                                    · žadyn hłubjeny wliw na aplikaciju
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionContainer} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },
    semiSectionContainer: {
        width: "100%",
        marginTop: style.defaultMmd,
    },
});
