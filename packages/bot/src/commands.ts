import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandAutocompleteResponse,
  APIChatInputApplicationCommandInteraction,
  APIInteraction,
  APIInteractionResponse,
  APIMessageApplicationCommandInteraction,
  APIUserApplicationCommandInteraction,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import { InteractionContext } from "./interactions";
import { khlCalendarCallback, pwhlScheduleCallback } from "./commands/calendar";
import { aboutCallback } from "./commands/about";
import { teamAutocomplete } from "./commands/teamAutocomplete";
import { khlPlayerCallback, pwhlPlayerCallback } from "./commands/player";
import * as api from "api";
import { allTeams } from "./pwhl/team";

export type AppCommandCallbackT<T extends APIInteraction> = (
  ctx: InteractionContext<T>,
) => Promise<
  APIInteractionResponse | [APIInteractionResponse, () => Promise<void>]
>;
export type ChatInputAppCommandCallback =
  AppCommandCallbackT<APIChatInputApplicationCommandInteraction>;
export type MessageAppCommandCallback =
  AppCommandCallbackT<APIMessageApplicationCommandInteraction>;
export type UserAppCommandCallback =
  AppCommandCallbackT<APIUserApplicationCommandInteraction>;

type AutocompleteChoices = NonNullable<
  APIApplicationCommandAutocompleteResponse["data"]["choices"]
>;
export type AppCommandAutocompleteCallback = (
  ctx: InteractionContext<APIApplicationCommandAutocompleteInteraction>,
) => Promise<AutocompleteChoices>;

export type AppCommandCallback =
  | ChatInputAppCommandCallback
  | MessageAppCommandCallback
  | UserAppCommandCallback;

export type AppCommand = RESTPostAPIApplicationCommandsJSONBody & {
  handlers: Record<string, AppCommandCallback>;
  autocompleteHandlers?: Record<string, AppCommandAutocompleteCallback>;
};

export const appCommands: Record<
  ApplicationCommandType,
  Record<string, AppCommand>
> = {
  [ApplicationCommandType.ChatInput]: {
    schedule: {
      name: "schedule",
      name_localizations: {
        ru: "kалендарь",
        "zh-CN": "赛程",
      },
      description: "...",
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "khl",
          name_localizations: {
            ru: "кхл",
          },
          description:
            "Get all KHL games for a specific date, or today if not specified",
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: "date",
              description: "YYYY-MM-DD",
              max_length: 10,
              required: false,
            },
            {
              type: ApplicationCommandOptionType.String,
              name: "team",
              description: "The team to get games for",
              required: false,
              autocomplete: true,
              // choices: api.allTeams.map((team) => {
              //   // For some reason Discord doesn't like when you provide
              //   // a localization that's the same as the `name`
              //   const getName = (locale: keyof typeof team.names) =>
              //     `${team.names[locale]} (${team.locations[locale]})`;
              //   return {
              //     name: getName("en"),
              //     name_localizations: {
              //       ru: getName("ru"),
              //     },
              //     value: String(team.id),
              //   };
              // }),
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "pwhl",
          name_localizations: {
            fr: "lphf",
          },
          description:
            "Get the PWHL schedule. Defaults to today if not specified",
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: "season",
              name_localizations: {
                fr: "saison",
              },
              description: "Defaults to the current season",
              choices: [
                // We can avoid using autocomplete for the first 8.3 years of this bot!
                // 25 choices total; one pre-, regular-, and post-season per year.
                // The only downside is that obviously we have to manually update this,
                // but it's trivial to do so before the season begins.
                {
                  name: "2024 Regular Season",
                  name_localizations: {
                    fr: "Saison Régulière 2024",
                  },
                  value: "1",
                },
                {
                  name: "2024 Preseason",
                  value: "2",
                },
              ],
              required: false,
            },
            {
              type: ApplicationCommandOptionType.String,
              name: "month",
              name_localizations: { fr: "mois" },
              description: "Defaults to the current month",
              required: false,
              choices: [
                {
                  name: "January",
                  name_localizations: { fr: "Janvier" },
                  value: "0",
                },
                {
                  name: "February",
                  name_localizations: { fr: "Février" },
                  value: "1",
                },
                {
                  name: "March",
                  name_localizations: { fr: "Mars" },
                  value: "2",
                },
                {
                  name: "April",
                  name_localizations: { fr: "Avril" },
                  value: "3",
                },
                {
                  name: "May",
                  name_localizations: { fr: "Mai" },
                  value: "4",
                },
                {
                  name: "June",
                  name_localizations: { fr: "Juin" },
                  value: "5",
                },
                {
                  name: "July",
                  name_localizations: { fr: "Juillet" },
                  value: "6",
                },
                {
                  name: "August",
                  name_localizations: { fr: "Août" },
                  value: "7",
                },
                {
                  name: "September",
                  name_localizations: { fr: "Septembre" },
                  value: "8",
                },
                {
                  name: "October",
                  name_localizations: { fr: "Octobre" },
                  value: "9",
                },
                {
                  name: "November",
                  name_localizations: { fr: "Novembre" },
                  value: "10",
                },
                {
                  name: "December",
                  name_localizations: { fr: "Décembre" },
                  value: "11",
                },
              ],
            },
            {
              type: ApplicationCommandOptionType.String,
              name: "team",
              name_localizations: { fr: "equipe" },
              description: "The team to get games for",
              required: false,
              choices: allTeams.map((team) => ({
                name: team.nickname,
                value: team.id,
              })),
            },
          ],
        },
      ],
      handlers: {
        khl: khlCalendarCallback,
        pwhl: pwhlScheduleCallback,
      },
      autocompleteHandlers: {
        khl: teamAutocomplete,
      },
    },
    player: {
      name: "player",
      name_localizations: {
        ru: "игрок",
        "zh-CN": "玩家",
        fr: "joueur",
      },
      description: "...",
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "khl",
          name_localizations: {
            ru: "кхл",
          },
          description: "Get info for a player",
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: "name",
              name_localizations: {
                fr: "nom",
              },
              description: "The name of the player",
              description_localizations: {
                fr: "Le nom du joueur",
              },
              required: true,
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "pwhl",
          name_localizations: {
            fr: "lphf",
          },
          description: "Get info for a player",
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: "name",
              name_localizations: {
                fr: "nom",
              },
              description: "The name of the player",
              description_localizations: {
                fr: "Le nom du joueur",
              },
              required: true,
            },
          ],
        },
      ],
      handlers: {
        khl: khlPlayerCallback,
        pwhl: pwhlPlayerCallback,
      },
    },
    about: {
      name: "about",
      description: "About this bot",
      handlers: {
        BASE: aboutCallback,
      },
    },
  },
  [ApplicationCommandType.Message]: {},
  [ApplicationCommandType.User]: {},
};

export type DiscordInteractionResponse =
  | APIInteractionResponse
  | { error: string; status?: number };

class JsonResponse extends Response {
  constructor(body: DiscordInteractionResponse, init_?: ResponseInit | null) {
    const jsonBody = JSON.stringify(body);
    const init = init_ || {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    };
    super(jsonBody, init);
  }
}

export const respond = (body: DiscordInteractionResponse) => {
  return new JsonResponse(
    body,
    "error" in body ? { status: body.status ?? 400 } : null,
  );
};
