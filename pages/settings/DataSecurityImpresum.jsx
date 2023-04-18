import React from "react";
import { View, Pressable, StyleSheet, ScrollView, Text } from "react-native";

import * as style from "../../styles";

import { getLangs } from "../../constants/langs";

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
                            Łusč 1e {"\n"}
                            02699 Bóšicy
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
                                Email: info@kostrjanc.de {"\n"}
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

                    <View style={style.pH}>
                        <Text style={smTextStyles}>
                            Najebać swědomiteje wobsahoweje kontrole njerukujemy
                            za wobsahi eksternych linkow. Wužiwarjo maja móžnosć
                            postować bjez filtrowym systemom. Pola
                            njedodźerženjow prawow našich regulow so přidawki
                            wostronja a wužiwar přewza połnu winu. Naša
                            platforma přewza funkciju komunikacije mjez serbskim
                            ludom. Za tute su wuwzaćnje poskićerjo abo
                            wobhospodarjo sami zamołwići. Platforma ma so ryzy
                            serbsce wužiwać. Wužiwarjo so njechłostaja, při
                            wužiwanju druhich rěčow. Prosymy tohodla, na
                            serbšćinu dźiwać. Wšitke wot wobhospodarjow tutych
                            stronow wudźěłane wobsahi a dźěła (teksty a wobrazy)
                            podleža němskemu awtorskemu prawu. Za rozmnoženje,
                            wobdźěłanje, rozšěrjenje a kóždežkuli wužiwanje
                            zwonka hranicow awtorskeho prawa je trěbna pisomna
                            dowolnosć awtora. Downloady a kopije tajkich stronow
                            su jeničce za priwatne, njekomercionelne wužiwanje
                            dowolene. Dalokož so wobsahi na tutych stronach
                            njejsu wot wobhospodarja wudźěłali, maja so awtorske
                            prawa třećich wobkedźbować. Wobsahi třećich maja so
                            jako tajke woznamjenić.
                        </Text>
                    </View>
                </View>

                {/* Škit datow */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.Ttitle2, style.tWhite]}>
                        {getLangs(
                            "settings_datasecurityimpresum_datasecurity_title"
                        )}
                    </Text>

                    <View style={style.pH}>
                        <Text style={smTextStyles}>
                            Wužiwanje wot kostrjanc je ryzy dobrowólnje. Daty,
                            kiž so zapodaja, njejsu za třěćeho widźomnje a
                            njejsu komercijelny srědk. Skedźbnjamy na to, zo
                            móže přenjesenje datow w interneće (n. př. při
                            komunikaciji z mejlku) wěstotne dźěry měć. Dospołny
                            škit datow před zapřimnjenjom třećich njeje móžny.
                            Wužiwanju w ramiku impresumoweje winowatosće
                            wozjewjenych kontaktowych datow přez třećich k
                            připósłaću nic wuraznje požadaneho wabjenja a
                            informaciskich materialijow so z tym wuraznje
                            znapřećiwja. Wobhospodarjo stronow wobchowaja sej w
                            padźe nježadaneho připósłaća wabjenskich
                            informacijow, n. př. z pomocu spam-mejlkow, prawo na
                            prawniske kročele. Wšitke daty, kiž su so wot
                            wužiwarja na kostrjanc zapodali, dadźa so kóždy čas
                            w zastajenjach eksportować a začitać dać.
                        </Text>
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
