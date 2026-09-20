const questForm = {
  titleLabel: '📝 Tytuł:',
  titlePlaceholder: 'Wpisz tytuł',
  descriptionLabel: '📖 Opis:',
  descriptionPlaceholder: 'Wpisz opis',
  startDateLabel: '📅 Data początkowa:',
  startDatePlaceholder: 'Wybierz datę początkową',
  endDateLabel: '📅 Data końcowa:',
  endDatePlaceholder: 'Wybierz datę końcową',
  scheduledTimeLabel: '⏰ Zaplanowana godzina:',
  scheduledTimePlaceholder: 'Wybierz godzinę',
  tagsLabel: '🏷️ Tagi:',
  tagsPlaceholder: 'Wybierz tagi zadania',
  tagsNoContent: 'Brak dostępnych tagów, najpierw utwórz jakiś',
  cancelButton: 'Anuluj',
};

/** Used by the status filter, the quest status badge and the statistics tile alike. */
const COMPLETED_LABEL = 'Zakończone';

const showModal = {
  closeButton: 'Zamknij',
  editButton: 'Edytuj',
  deleteButton: 'Usuń',
  deletedSuccess: 'Zadanie usunięte.',
  deletedError: 'Nie udało się usunąć zadania. Spróbuj ponownie.',
};

const quests = {
  /** „Zrobiłem, ale zapomniałem odhaczyć” — okno 2 dni wstecz. */
  catchUp: {
    heading: 'Nieodhaczone z ostatnich dni',
    summary_one: 'Masz {{count}} nawyk do nadrobienia',
    summary_other: 'Masz {{count}} nawyki do nadrobienia',
    summary_many: 'Masz {{count}} nawyków do nadrobienia',
    today: 'Dziś',
    yesterday: 'Wczoraj',
    markDone: 'Zrobione',
    /** Partial periods land here too, so the row has to be able to say „1 / 2”. */
    progress: '{{progress}} / {{target}}',
    dismiss: 'Ukryj',
  },
  /** The one add/edit form that replaced the five per-type modals. */
  questForm: {
    addHeading: 'Nowe zadanie',
    updateHeading: 'Edytuj zadanie',
    submitButton: 'Dodaj',
    updateButton: 'Zapisz',
    loadingMessage: 'Zapisywanie zadania...',
    addedSuccess: 'Zadanie dodane.',
    addedError: 'Nie udało się dodać zadania. Spróbuj ponownie.',
    updatedSuccess: 'Zadanie zaktualizowane.',
    updatedError: 'Nie udało się zaktualizować zadania. Spróbuj ponownie.',
    /** Editing the schedule drops only future, untouched periods — history and streaks survive. */
    updateScheduleNote: 'Zmiana powtarzalności nie kasuje historii ani serii — przestawia tylko przyszłe okresy.',
  },
  /*
   * Only the season NAMES survive the per-type cleanup. A season is a year window in the API,
   * not a quest type, and these four labels are what `SEASON_YEAR_WINDOWS` maps onto.
   */
  seasonal: {
    seasons: {
      winter: 'Zima',
      spring: 'Wiosna',
      summer: 'Lato',
      autumn: 'Jesień',
    },
  },
  all: {
    title: 'Nawyki',
    /** The chips that replaced the per-type screens. */
    scopes: {
      all: 'Wszystkie',
      repeating: 'Powtarzalne',
      oneOff: 'Jednorazowe',
      daily: 'Dzienne',
      weekly: 'Tygodniowe',
      monthly: 'Miesięczne',
      yearly: 'Sezonowe',
      atRisk: 'Zagrożone',
    },
    recurringTitle: 'Wszystkie zadania cykliczne',
    noQuestsFound: 'Nie znaleziono zadań.',
    fetchingQuests: 'Wczytywanie zadań...',
    addNewQuest: 'Dodaj nowe zadanie',
    selectQuestType: 'Wybierz typ zadania',
    questTypes: {
      oneTime: 'Jednorazowe',
      seasonal: 'Sezonowe',
      monthly: 'Miesięczne',
      daily: 'Dzienne',
      weekly: 'Tygodniowe',
    },
  },
  today: {
    title: 'Zadania na dziś',
    noQuestsFound: 'Nie znaleziono zadań.',
    fetchingQuests: 'Wczytywanie zadań...',
    addNewQuest: 'Dodaj nowe zadanie',
  },
  tags: {
    title: 'Tagi zadań',
    noTagsFound: 'Nie znaleziono tagów.',
    fetchingTags: 'Wczytywanie tagów...',
    addNewTag: 'Dodaj nowy tag',
    sortTitleLabel: 'Tytuł',
    cancelButton: 'Anuluj',
    nameLabel: 'Nazwa tagu',
    namePlaceholder: 'Wpisz nazwę tagu',
    backgroundColorLabel: 'Wybierz kolor tła:',
    previewLabel: 'Podgląd tagu:',
    previewFallback: 'Przykładowy tag',
    addModal: {
      heading: 'Utwórz nowy tag:',
      submitButton: 'Dodaj tag',
      loadingMessage: 'Dodawanie tagu...',
      addedSuccess: 'Tag dodany!',
      addedError: 'Nie udało się dodać tagu. Spróbuj ponownie.',
    },
    updateModal: {
      heading: 'Zaktualizuj tag:',
      submitButton: 'Zapisz tag',
      loadingMessage: 'Zapisywanie tagu...',
      updatedSuccess: 'Tag zaktualizowany!',
      updatedError: 'Nie udało się zaktualizować tagu. Spróbuj ponownie.',
    },
    deletedSuccess: 'Tag usunięty.',
    deletedError: 'Nie udało się usunąć tagu. Spróbuj ponownie.',
    schema: {
      required: 'Tag nie może być pusty',
      maxLength: 'Tag jest za długi. Maksymalnie 25 znaków.',
      unique: 'Ten tag już istnieje. Wybierz inną nazwę.',
    },
  },
  reusable: {
    header: {
      searchPlaceholder: 'Szukaj...',
    },
    filters: {
      status: {
        all: 'Wszystkie',
        completed: COMPLETED_LABEL,
        incomplete: 'Niezakończone',
      },
      priority: {
        low: 'Niski',
        medium: 'Średni',
        high: 'Wysoki',
      },
    },
    showModal,
    itemCheckmark: {
      completedSuccess: 'Zadanie oznaczone jako zakończone.',
      incompleteSuccess: 'Zadanie oznaczone jako niezakończone.',
      updateError: 'Nie udało się zaktualizować zadania. Spróbuj ponownie.',
    },
    period: {
      /** Only ever shown when the backend says so — never derived from „not done yet”. */
      atRisk: '⚠️ Jeszcze {{remaining}}, a zostały {{count}} dni',
      atRisk_one: '⚠️ Jeszcze {{remaining}}, a został {{count}} dzień',
      periodEnds: 'Okres do {{date}}',
    },
    schedule: {
      once: 'Jednorazowe',
      daily: 'Codziennie',
      everyNDays: 'Co {{count}} dni',
      timesPerWeek: '{{count}}× w tygodniu',
      timesPerMonth: '{{count}} dni w miesiącu',
      /** A measured target on a week or month — the number carries a unit, so it is not a day count. */
      unitsPerWeek: '{{amount}} {{unit}} w tygodniu',
      unitsPerMonth: '{{amount}} {{unit}} w miesiącu',
      everyNWeeks: 'co {{count}} tyg.',
      everyNMonths: 'co {{count}} mies.',
      everyNYears: 'co {{count}} lata',
      monthWindow: 'Dni {{start}}–{{end}} miesiąca',
      /** A year window that is not one of the four season presets. */
      yearWindow: 'Co roku {{start}} – {{end}}',
      yearly: 'Co roku',
      /** Appended to the recurrence when the target carries a unit: „Codziennie · 2 L”. */
      targetSuffix: '{{amount}} {{unit}}',
      /** Appended when the target is a plain repeat count: „Codziennie · 2×”. */
      targetTimes: '{{count}}×',
    },
    completion: {
      /** One tap that did not yet close the period — „2 / 3”. */
      progressSaved: 'Zapisane: {{progress}}.',
      periodCompleted: 'Zrobione! 🎉',
      rewardEarned: 'Zrobione! 🎉 +{{xp}} XP, +{{coins}} monet',
      undone: 'Cofnięto odhaczenie.',
      /** The backend rejected a second tap on the same day — the weekly cap did its job. */
      dailyLimitReached: 'Na dziś już odhaczone. Wróć jutro.',
      error: 'Nie udało się zapisać. Spróbuj ponownie.',
      undoError: 'Nie udało się cofnąć. Spróbuj ponownie.',
      /** Shown instead of a button when the quest simply is not due today. */
      notScheduledToday: 'Dziś niezaplanowane',
    },
    form: {
      /* Title, description, dates, time and tags — they used to be spread into each per-type section. */
      ...questForm,
      startDayLabel: '🚀 Dzień początkowy:',
      endDayLabel: '🏁 Dzień końcowy:',
      difficultyLabel: '⚔️ Trudność:',
      difficultyPlaceholder: 'Wybierz trudność',
      difficulties: {
        easy: 'Łatwy',
        medium: 'Średni',
        hard: 'Trudny',
        impossible: 'Niemożliwy',
      },
      priorityLabel: '⚡ Priorytet:',
      priorityPlaceholder: 'Wybierz priorytet',
      priorities: {
        high: 'Wysoki',
        medium: 'Średni',
        low: 'Niski',
      },
      seasonLabel: '🌦️ Sezon:',
      seasonPlaceholder: 'Wybierz sezon',
      emojiLabel: '😄 Emoji:',
      emojiPlaceholder: 'Kliknij, aby wybrać emoji zadania',
      cancelButton: 'Anuluj',
      recurrenceLabel: '🔁 Powtarzalność:',
      recurrencePlaceholder: 'Jak często?',
      presets: {
        once: 'Jednorazowo',
        daily: 'Codziennie',
        weekdays: 'W wybrane dni tygodnia',
        everyNDays: 'Co kilka dni',
        timesPerWeek: 'X razy w tygodniu',
        timesPerMonth: 'X dni w miesiącu',
        unitsPerWeek: 'Ile w tygodniu (np. 15 km)',
        unitsPerMonth: 'Ile w miesiącu (np. 15 km)',
        monthWindow: 'W oknie miesiąca',
        seasonal: 'Sezonowo',
      },
      intervalLabel: '📆 Co ile dni:',
      /** The anchor is the start date, so without one the user cannot tell which days land. */
      intervalHint: 'Odliczane od daty początkowej — ustaw ją, żeby wiedzieć, które dni wypadają.',
      timesPerWeekLabel: '🎯 Ile razy w tygodniu:',
      timesPerMonthLabel: '🎯 Ile dni w miesiącu:',
      /** The API takes `interval` on every unit, so a period longer than a day can repeat every N. */
      intervalWeeksLabel: '📆 Co ile tygodni:',
      intervalMonthsLabel: '📆 Co ile miesięcy:',
      intervalYearsLabel: '📆 Co ile lat:',
      periodIntervalHint: 'Zostaw 1, żeby okres wracał za każdym razem.',
      /** `maxCompletionsPerDay: 1` is what makes this preset mean anything. */
      timesPerPeriodHint: 'Jedno odhaczenie dziennie — nie da się zrobić całego tygodnia w poniedziałek.',
      targetAmountLabel: '🎯 Cel na jeden okres:',
      targetUnitLabel: '📏 Jednostka (opcjonalnie):',
      targetUnitPlaceholder: 'np. L, stron, min',
      targetHint: 'Np. 2 przy „Codziennie” = zrobić coś dwa razy dziennie. Zostaw 1, jeśli wystarczy zwykłe odhaczenie.',
      maxPerDayLabel: '🔒 Maks. odhaczeń dziennie:',
      /** 1 is what stops a weekly target from being finished in one sitting. */
      maxPerDayHint: 'Zostaw 1, żeby nie dało się zrobić całego tygodnia w jeden dzień.',
      durationLabel: '⏱️ Ile to zajmuje (min):',
      durationPlaceholder: 'np. 30',
      /** Nothing in the app reads it yet — it is there for the planned calendar export. */
      durationHint: 'Na razie nieużywane w aplikacji — przyda się przy eksporcie do kalendarza.',
      /** The year window IS the recurrence — an end date would kill the quest after one season. */
      seasonalEndDateWarning: 'Nie ustawiaj daty końcowej — sezon i tak wraca co roku.',
    },
    schema: {
      titleRequired: 'Tytuł jest wymagany',
      titleMinLength: 'Tytuł musi mieć co najmniej 3 znaki',
      startDateInvalid: 'Data początkowa nie może być wcześniejsza niż dozwolona',
      endDateInvalid: 'Data końcowa musi być taka sama lub późniejsza niż data początkowa',
      tagIdRequired: 'Identyfikator tagu jest wymagany',
      tagRequired: 'Tag nie może być pusty',
      tagTooLong: 'Tag jest za długi. Maksymalnie 25 znaków.',
      recurrenceRequired: 'Wybierz powtarzalność',
      weekdaysMin: 'Wybierz przynajmniej jeden dzień tygodnia',
      intervalRange: 'Podaj liczbę dni od 2 do 366',
      /** Without an anchor „every 2 days” is unpredictable, so the date stops being optional here. */
      intervalNeedsStartDate: 'Przy „co kilka dni” ustaw datę początkową — od niej liczone są kolejne dni',
      timesPerWeekRange: 'Podaj liczbę od 1 do 7',
      timesPerMonthRange: 'Podaj liczbę od 1 do 31',
      monthDayRange: 'Dzień miesiąca musi być w zakresie 1–31',
      monthWindowOrder: 'Dzień końcowy nie może być wcześniejszy niż początkowy',
      seasonRequired: 'Wybierz sezon',
      /** The year window is the recurrence — an end date would stop it after one season. */
      seasonalEndDateForbidden: 'Sezonowy quest wraca co roku — zostaw datę końcową pustą',
      targetAmountRange: 'Cel musi być liczbą od 1 do 100000',
      targetAmountWhole: 'Bez jednostki cel musi być liczbą całkowitą',
      targetUnitTooLong: 'Jednostka może mieć maksymalnie 20 znaków',
      maxPerDayRange: 'Podaj liczbę od 1 do wartości celu',
      periodIntervalRange: 'Podaj liczbę całkowitą od 1 do 366',
      durationRange: 'Czas trwania musi być liczbą całkowitą od 1 do 1440 minut',
    },
    difficulty: {
      prefix: 'Trudność:',
      descriptions: {
        easy: 'Niski wysiłek, przyjazne dla początkujących',
        medium: 'Umiarkowane wyzwanie',
        hard: 'Wysoki poziom trudności, dla zaawansowanych',
        impossible: 'Niemal niemożliwe, ekstremalne wyzwanie',
      },
    },
    priority: {
      prefix: 'Priorytet:',
      descriptions: {
        high: 'Wymaga natychmiastowej uwagi',
        medium: 'Umiarkowane znaczenie',
        low: 'Niski priorytet, może czekać',
      },
    },
    season: {
      prefix: 'Sezon:',
      descriptions: {
        winter: 'Zimny i śnieżny sezon',
        spring: 'Sezon wzrostu i odnowy',
        summer: 'Gorące i słoneczne dni',
        autumn: 'Chłodna i kolorowa jesień',
      },
    },
    status: {
      completedTitle: COMPLETED_LABEL,
      completedDescription: 'Świetna robota! To zadanie zostało zakończone.',
      inProgressTitle: 'W trakcie',
      inProgressDescription: 'To zadanie jest obecnie aktywne. Nie przestawaj, aż je zakończysz!',
    },
    dates: {
      heading: 'Daty',
      notSet: 'Nie ustawiono',
      startDateLabel: 'Data początkowa:',
      endDateLabel: 'Data końcowa:',
      timeRemainingLabel: 'Pozostały czas:',
      expired: '(⏰ Wygasło)',
      noDeadline: '(Brak terminu)',
      lastDay: '(⚡ Ostatni dzień!)',
      daysLeftUrgent: '(⏳ Pozostało {{count}} dni)',
      daysLeftWarning: '(🕒 Pozostało {{count}} dni)',
      daysLeftNormal: '(Pozostało {{count}} dni)',
    },
    scheduled: {
      heading: 'Zaplanowana godzina',
      timeOfDay: {
        earlyMorning: '🌙 Wczesny ranek',
        morning: '☀️ Rano',
        afternoon: '🌤️ Popołudnie',
        evening: '🌃 Wieczór',
        night: '🌌 Noc',
      },
    },
    statistics: {
      heading: 'Statystyki',
      completed: COMPLETED_LABEL,
      occurrences: 'Wystąpienia',
      failures: 'Niepowodzenia',
      streak: 'Seria',
      longest: 'Najdłuższa',
      /** A streak of 5 on a weekly habit is five weeks — without the unit the number lies. */
      streakUnit: {
        Day: 'dni',
        Week: 'tyg.',
        Month: 'mies.',
        Year: 'lat',
        None: '',
      },
    },
    days: {
      monday: 'Pon',
      tuesday: 'Wt',
      wednesday: 'Śr',
      thursday: 'Czw',
      friday: 'Pt',
      saturday: 'Sob',
      sunday: 'Ndz',
    },
    weekly: {
      daysLabel: 'Dni:',
      heading: 'Powtarza się w',
      allDays: 'Wszystkie dni',
    },
    monthly: {
      heading: 'Występuje w dniu',
    },
    tags: {
      heading: 'Tagi zadania:',
    },
    description: {
      heading: 'Opis:',
    },
    timePicker: {
      setTimeButton: 'Ustaw godzinę',
    },
  },
  analytics: {
    loading: 'Wczytywanie statystyk...',
    openFromQuest: 'Zobacz pełne statystyki',
    rangeLabel: 'Okres: {{from}} – {{to}}',
    // Ranges are always 30/90/365, so every value takes the same plural form.
    range: {
      days: '{{days}} dni',
    },
    outcome: {
      completed: 'Zrobione',
      backfilled: 'Uzupełnione później',
      missed: 'Pominięte',
      pending: 'W trakcie',
      /** Elapsed with some progress but short of the target — counts as a miss, drawn as partial credit. */
      partial: 'Częściowo',
      unscheduled: 'Niezaplanowane',
    },
    summary: {
      completionRate: 'Skuteczność',
      currentStreak: 'Seria',
      longestStreak: 'Najdłuższa',
      inRange: 'w okresie',
      allTime: 'od zawsze',
      periodsHeading: 'Rozkład okresów',
      periodsBreakdown: 'Zrobione: {{completed}} · Częściowo: {{partial}} · Pominięte: {{missed}} · W trakcie: {{pending}}',
      /** How much of what was asked for actually got done, unlike completionRate which is all-or-nothing. */
      progressRate: 'Postęp',
    },
    heatmap: {
      heading: 'Kalendarz',
      hint: 'Puste pole oznacza dzień, w którym nawyk nie był zaplanowany.',
    },
    trend: {
      heading: 'Trend skuteczności',
      hint: 'Kreska zamiast słupka oznacza okres bez zaplanowanych wystąpień.',
      granularity: {
        day: 'w podziale na dni',
        week: 'w podziale na tygodnie',
        month: 'w podziale na miesiące',
      },
    },
    hour: {
      heading: 'Pora dnia',
      hint: 'O której faktycznie to robisz. Wpisy sprzed migracji nie mają godziny i są pomijane.',
      /** e.g. „7:00–8:00” */
      hourLabel: '{{hour}}:00',
    },
    weekday: {
      heading: 'Dni tygodnia',
      hint: 'W które dni najczęściej Ci to ucieka.',
      /** Used when the schedule pins no weekdays, so „ucieka” has no denominator to be measured against. */
      hintActivity: 'W które dni faktycznie to robisz.',
      /** e.g. „9 z 12 poniedziałków” */
      scheduledRatio: '{{done}} z {{scheduled}}',
      completionsCount: '{{count}} odhaczeń',
    },
    empty: {
      heading: 'Brak wystąpień w tym okresie',
      hint: 'Wybierz dłuższy zakres albo poczekaj, aż nawyk się rozkręci.',
    },
    error: {
      heading: 'Nie udało się wczytać statystyk',
      hint: 'Statystyki są dostępne tylko dla zadań powtarzalnych — jednorazowe nie mają serii ani trendu.',
    },
    overview: {
      title: 'Statystyki nawyków',
      donePeriods: 'Zrobione',
      habitsCount: 'Nawyki',
      repeatable: 'powtarzalne',
      dailyRateHeading: 'Dzień po dniu',
      dailyRateHint: 'Ile procent zaplanowanych nawyków udało się zrobić danego dnia.',
      scaleLess: 'mniej',
      scaleMore: 'więcej',
      rankingHeading: 'Twoje nawyki',
      rankingHint: 'Od najlepiej trzymanych do tych, które wymagają uwagi.',
      questMeta: 'Zrobione {{completed}} z {{evaluated}}',
      questNoData: 'Brak ocenionych okresów w tym zakresie',
      emptyHeading: 'Nie masz jeszcze powtarzalnych nawyków',
      emptyHint: 'Dodaj powtarzalne zadanie, żeby zobaczyć tu statystyki.',
      /** Week/Month/Year periods have no place on a per-day axis, so they get their own tile. */
      periodicHeading: 'Okresy tygodniowe i dłuższe',
      periodicHint: 'Cele tygodniowe, miesięczne i roczne liczone osobno — jeden nieudany tydzień nie maluje siedmiu dni na czerwono.',
      dailyOnlyNote: 'Wykres dzienny pokazuje wyłącznie nawyki dzienne.',
    },
  },
};

export default quests;
