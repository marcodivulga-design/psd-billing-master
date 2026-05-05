import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";

// Liturgical year cycles
const LITURGICAL_CYCLES = ["A", "B", "C"] as const;

// Liturgical colors and their meanings
const LITURGICAL_COLORS = {
  white: { name: "Branco", meaning: "Pureza, Alegria, Ressurreição", hex: "#FFFFFF" },
  red: { name: "Vermelho", meaning: "Martírio, Pentecostes, Amor", hex: "#DC143C" },
  green: { name: "Verde", meaning: "Esperança, Crescimento Espiritual", hex: "#228B22" },
  purple: { name: "Roxo", meaning: "Penitência, Preparação, Advento", hex: "#800080" },
  gold: { name: "Ouro", meaning: "Solenidade, Glória Divina", hex: "#FFD700" },
  black: { name: "Preto", meaning: "Luto, Finados", hex: "#000000" },
  rose: { name: "Rosa", meaning: "Alegria na Penitência", hex: "#FF69B4" },
};

// Liturgical seasons
const LITURGICAL_SEASONS = [
  { name: "Advento", startMonth: 11, startDay: 27, endMonth: 12, endDay: 24, color: "purple" },
  { name: "Natal", startMonth: 12, startDay: 25, endMonth: 1, endDay: 9, color: "white" },
  { name: "Epifania", startMonth: 1, startDay: 10, endMonth: 2, endDay: 8, color: "white" },
  { name: "Quaresma", startMonth: 2, startDay: 1, endMonth: 4, endDay: 8, color: "purple" },
  { name: "Páscoa", startMonth: 4, startDay: 9, endMonth: 5, endDay: 29, color: "white" },
  { name: "Pentecostes", startMonth: 5, startDay: 30, endMonth: 6, endDay: 8, color: "red" },
  { name: "Tempo Comum", startMonth: 6, startDay: 9, endMonth: 11, endDay: 26, color: "green" },
];

// Major liturgical feasts
const MAJOR_FEASTS = [
  { date: "01-01", name: "Circuncisão do Senhor", color: "white" },
  { date: "01-06", name: "Epifania", color: "white" },
  { date: "02-02", name: "Apresentação do Senhor", color: "white" },
  { date: "03-19", name: "São José", color: "white" },
  { date: "03-25", name: "Anunciação", color: "white" },
  { date: "05-01", name: "São José Trabalhador", color: "white" },
  { date: "06-24", name: "Natividade de São João Batista", color: "white" },
  { date: "06-29", name: "São Pedro e São Paulo", color: "red" },
  { date: "08-15", name: "Assunção de Maria", color: "white" },
  { date: "09-01", name: "Dia do Trabalho", color: "green" },
  { date: "11-01", name: "Todos os Santos", color: "white" },
  { date: "11-02", name: "Finados", color: "black" },
  { date: "12-08", name: "Imaculada Conceição", color: "white" },
  { date: "12-25", name: "Natal do Senhor", color: "white" },
];

export const liturgicalCalendarRouter = router({
  // Get current liturgical year cycle
  getCurrentCycle: protectedProcedure.query(async () => {
    const now = new Date();
    const year = now.getFullYear();
    const cycleIndex = (year - 1962) % 3;
    const cycle = LITURGICAL_CYCLES[cycleIndex];

    return {
      year,
      cycle,
      cycleIndex,
      startDate: new Date(year, 10, 27),
      endDate: new Date(year + 1, 10, 26),
    };
  }),

  // Get liturgical season for a specific date
  getSeasonForDate: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ input }) => {
      for (const season of LITURGICAL_SEASONS) {
        const startDate = new Date(input.date.getFullYear(), season.startMonth - 1, season.startDay);
        const endDate = new Date(input.date.getFullYear(), season.endMonth - 1, season.endDay);

        if (input.date >= startDate && input.date <= endDate) {
          return {
            season: season.name,
            color: LITURGICAL_COLORS[season.color as keyof typeof LITURGICAL_COLORS],
            startDate,
            endDate,
          };
        }
      }

      return null;
    }),

  // Get all liturgical colors
  getAllColors: protectedProcedure.query(async () => {
    return Object.entries(LITURGICAL_COLORS).map(([key, value]) => ({
      code: key,
      ...value,
    }));
  }),

  // Get all major feasts for a year
  getMajorFeasts: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ input }) => {
      return MAJOR_FEASTS.map((feast) => {
        const [month, day] = feast.date.split("-").map(Number);
        return {
          ...feast,
          date: new Date(input.year, month - 1, day),
          color: LITURGICAL_COLORS[feast.color as keyof typeof LITURGICAL_COLORS],
        };
      });
    }),

  // Get liturgical calendar for a month
  getMonthlyCalendar: protectedProcedure
    .input(
      z.object({
        year: z.number(),
        month: z.number().min(1).max(12),
      })
    )
    .query(async ({ input }) => {
      const daysInMonth = new Date(input.year, input.month, 0).getDate();
      const calendar = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(input.year, input.month - 1, day);
        const dateStr = `${String(day).padStart(2, "0")}-${String(input.month).padStart(2, "0")}`;

        const feast = MAJOR_FEASTS.find((f) => f.date === dateStr);

        let season = null;
        for (const s of LITURGICAL_SEASONS) {
          const startDate = new Date(input.year, s.startMonth - 1, s.startDay);
          const endDate = new Date(input.year, s.endMonth - 1, s.endDay);

          if (date >= startDate && date <= endDate) {
            season = {
              name: s.name,
              color: LITURGICAL_COLORS[s.color as keyof typeof LITURGICAL_COLORS],
            };
            break;
          }
        }

        calendar.push({
          date,
          day,
          dayOfWeek: date.toLocaleDateString("pt-BR", { weekday: "long" }),
          feast: feast
            ? {
                name: feast.name,
                color: LITURGICAL_COLORS[feast.color as keyof typeof LITURGICAL_COLORS],
              }
            : null,
          season,
        });
      }

      return calendar;
    }),

  // Get next major feast
  getNextFeast: protectedProcedure.query(async () => {
    const now = new Date();
    const year = now.getFullYear();

    for (const feast of MAJOR_FEASTS) {
      const [month, day] = feast.date.split("-").map(Number);
      const feastDate = new Date(year, month - 1, day);

      if (feastDate > now) {
        return {
          ...feast,
          date: feastDate,
          daysUntil: Math.ceil((feastDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          color: LITURGICAL_COLORS[feast.color as keyof typeof LITURGICAL_COLORS],
        };
      }
    }

    const nextYear = year + 1;
    const firstFeast = MAJOR_FEASTS[0];
    const [month, day] = firstFeast.date.split("-").map(Number);
    const feastDate = new Date(nextYear, month - 1, day);

    return {
      ...firstFeast,
      date: feastDate,
      daysUntil: Math.ceil((feastDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      color: LITURGICAL_COLORS[firstFeast.color as keyof typeof LITURGICAL_COLORS],
    };
  }),

  // Get vestment color for a specific date
  getVestmentColor: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ input }) => {
      const dateStr = `${String(input.date.getDate()).padStart(2, "0")}-${String(
        input.date.getMonth() + 1
      ).padStart(2, "0")}`;
      const feast = MAJOR_FEASTS.find((f) => f.date === dateStr);

      if (feast) {
        return LITURGICAL_COLORS[feast.color as keyof typeof LITURGICAL_COLORS];
      }

      for (const season of LITURGICAL_SEASONS) {
        const startDate = new Date(input.date.getFullYear(), season.startMonth - 1, season.startDay);
        const endDate = new Date(input.date.getFullYear(), season.endMonth - 1, season.endDay);

        if (input.date >= startDate && input.date <= endDate) {
          return LITURGICAL_COLORS[season.color as keyof typeof LITURGICAL_COLORS];
        }
      }

      return LITURGICAL_COLORS.green;
    }),

  // Get liturgical year summary
  getYearSummary: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ input }) => {
      const cycle = ((input.year - 1962) % 3) as 0 | 1 | 2;
      const cycles = ["A", "B", "C"];

      return {
        year: input.year,
        cycle: cycles[cycle],
        startDate: new Date(input.year - 1, 10, 27),
        endDate: new Date(input.year, 10, 26),
        seasons: LITURGICAL_SEASONS.map((s) => ({
          name: s.name,
          color: LITURGICAL_COLORS[s.color as keyof typeof LITURGICAL_COLORS],
        })),
        majorFeasts: MAJOR_FEASTS.length,
        sundays: 52,
      };
    }),
});
