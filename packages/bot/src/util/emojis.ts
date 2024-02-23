import {
  APIMessageComponentEmoji,
  APIPartialEmoji,
} from "discord-api-types/v10";
import { League } from "../db/schema";

export const leagueAssets: Record<
  League,
  { logo?: string; teamEmojis: Record<number, string> }
> = {
  khl: {
    teamEmojis: {
      61: "1192320180865466438",
      40: "1192320195600076871",
      12: "1192320186796220416",
      10: "1192320215942451361",
      56: "1192320285265891479",
      46: "1192320178474713138",
      16: "1192320194186592377",
      38: "1192320182224429076",
      8: "1192320219511804064",
      315: "1192320175698083920",
      105: "1192320210447896587",
      26: "1192320224217808907",
      30: "1192320222217130055",
      36: "1192320184069926974",
      32: "1192320204793987072",
      42: "1192320190080352336",
      24: "1192320191745503292",
      44: "1192320214109528064",
      113: "1192320172883718184",
      18: "1192319161175650404",
      22: "1192320286821982218",
      28: "1192320198385090611",
      34: "1192320177157722162",
      // Not in the KHL anymore but may appear in responses
      31: "1198642562689409024",
    },
  },
  pwhl: {
    logo: "https://hockey-bot.s3.us-east-005.backblazeb2.com/leagues/pwhl.jpg",
    teamEmojis: {
      1: "1194368779086479410",
      2: "1194368777832382605",
      3: "1194368786543956010",
      4: "1194368791283519660",
      5: "1194368782131540099",
      6: "1194368796224393328",
    },
  },
  ahl: {
    logo: "https://assets.leaguestat.com/ahl/logos/50x50/418.png",
    teamEmojis: {
      440: "1203027257640222782",
      402: "1203027525450604585",
      413: "1203027266972549120",
      317: "1203027311532834826",
      444: "1203027276506341406",
      384: "1203027310039535686",
      330: "1203027272597110824",
      373: "1203027270990561381",
      445: "1203027529364021268",
      419: "1203027319829172336",
      328: "1203027263558262948",
      307: "1203027301030170704",
      437: "1203027253538201663",
      319: "1203027522632294400",
      389: "1203027256331599912",
      415: "1203027296798253117",
      313: "1203027294323605614",
      321: "1203027530878025808",
      327: "1203027325508264026",
      403: "1203027318218424360",
      309: "1203027268503478322",
      323: "1203027520174170143",
      372: "1203027322832298084",
      404: "1203027328129826917",
      405: "1203027259288457216",
      411: "1203027315362103306",
      324: "1203027291488387123",
      380: "1203027261884989440",
      335: "1203027286467805255",
      412: "1203027282294480966",
      390: "1203027524091912282",
      316: "1203027284588761099",
      // Divisions
      407: "1203027245900242974",
      408: "1203027250988187730",
      409: "1203027243526397984",
      410: "1203027249260134400",
      // League
      418: "1203027240405696603",
    },
  },
};

export const getTeamPartialEmoji = (
  league: League,
  teamId: string | number,
): APIMessageComponentEmoji => {
  const emojiId = leagueAssets[league].teamEmojis[Number(teamId)];
  if (emojiId) {
    return { id: emojiId };
  }

  // A question mark default looked pretty bad. Players that have been transferred
  // to other leagues may still show up, so we want to compensate for them.
  return { name: "📃" };
};

export const getTeamEmoji = (league: League, teamId: string | number) => {
  const emoji = getTeamPartialEmoji(league, teamId);
  // biome-ignore lint/style/noNonNullAssertion:
  return emoji.id ? `<:_:${emoji.id}>` : emoji.name!;
};

export const getLeagueLogoUrl = (league: League) => {
  return leagueAssets[league].logo;
};

export const countryCodeEmoji = (cc: string) =>
  String.fromCodePoint(
    // biome-ignore lint/style/noNonNullAssertion:
    ...[...cc.toUpperCase()].map((c) => c.codePointAt(0)! + 127397),
  );
