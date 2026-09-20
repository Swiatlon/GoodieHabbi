const questForm = {
  titleLabel: '📝 Title:',
  titlePlaceholder: 'Enter the title',
  descriptionLabel: '📖 Description:',
  descriptionPlaceholder: 'Enter description',
  startDateLabel: '📅 Start Date:',
  startDatePlaceholder: 'Tap to pick start date',
  endDateLabel: '📅 End Date:',
  endDatePlaceholder: 'Tap to pick end date',
  scheduledTimeLabel: '⏰ Scheduled Time:',
  scheduledTimePlaceholder: 'Select time',
  tagsLabel: '🏷️ Tags:',
  tagsPlaceholder: 'Select quest tags',
  tagsNoContent: 'No tags available, please create some first',
  cancelButton: 'Cancel',
};

const showModal = {
  closeButton: 'Close',
  editButton: 'Edit',
  deleteButton: 'Delete',
  deletedSuccess: 'Quest deleted successfully.',
  deletedError: 'Failed to delete quest. Please try again.',
};

const quests = {
  /** "I did it but forgot to tick it" — a two day window. */
  catchUp: {
    heading: 'Unticked from the last few days',
    summary_one: 'You have {{count}} habit to catch up on',
    summary_other: 'You have {{count}} habits to catch up on',
    today: 'Today',
    yesterday: 'Yesterday',
    markDone: 'Done',
    /** Partial periods land here too, so the row has to be able to say "1 / 2". */
    progress: '{{progress}} / {{target}}',
    dismiss: 'Hide',
  },
  /** The one add/edit form that replaced the five per-type modals. */
  questForm: {
    addHeading: 'New quest',
    updateHeading: 'Edit quest',
    submitButton: 'Add',
    updateButton: 'Save',
    loadingMessage: 'Saving quest...',
    addedSuccess: 'Quest added.',
    addedError: 'Failed to add quest. Please try again.',
    updatedSuccess: 'Quest updated.',
    updatedError: 'Failed to update quest. Please try again.',
    /** Editing the schedule drops only future, untouched periods — history and streaks survive. */
    updateScheduleNote: 'Changing the recurrence keeps your history and streak — only future periods are re-planned.',
  },
  /*
   * Only the season NAMES survive the per-type cleanup. A season is a year window in the API,
   * not a quest type, and these four labels are what `SEASON_YEAR_WINDOWS` maps onto.
   */
  seasonal: {
    seasons: {
      winter: 'Winter',
      spring: 'Spring',
      summer: 'Summer',
      autumn: 'Autumn',
    },
  },
  all: {
    title: 'Habits',
    /** The chips that replaced the per-type screens. */
    scopes: {
      all: 'All',
      repeating: 'Repeating',
      oneOff: 'One-off',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Seasonal',
      atRisk: 'At risk',
    },
    recurringTitle: 'All Recurring Quests',
    noQuestsFound: 'No quests found.',
    fetchingQuests: 'Fetching quests...',
    addNewQuest: 'Add new Quest',
    selectQuestType: 'Select Quest Type',
    questTypes: {
      oneTime: 'One Time',
      seasonal: 'Seasonal',
      monthly: 'Monthly',
      daily: 'Daily',
      weekly: 'Weekly',
    },
  },
  today: {
    title: 'Today Quests',
    noQuestsFound: 'No quests found.',
    fetchingQuests: 'Fetching quests...',
    addNewQuest: 'Add new Quest',
  },
  tags: {
    title: 'Quest tags',
    noTagsFound: 'No tags found.',
    fetchingTags: 'Fetching tags...',
    addNewTag: 'Add new Tag',
    sortTitleLabel: 'Title',
    cancelButton: 'Cancel',
    nameLabel: 'Tag Name',
    namePlaceholder: 'Enter tag name',
    backgroundColorLabel: 'Pick a Background Color:',
    previewLabel: 'Tag Preview:',
    previewFallback: 'Example Tag',
    addModal: {
      heading: 'Create a New Tag:',
      submitButton: 'Add Tag',
      loadingMessage: 'Adding tag...',
      addedSuccess: 'Tag added successfully!',
      addedError: 'Failed to add tag. Please try again.',
    },
    updateModal: {
      heading: 'Update Tag:',
      submitButton: 'Update Tag',
      loadingMessage: 'Updating tag...',
      updatedSuccess: 'Tag updated successfully!',
      updatedError: 'Failed to update tag. Please try again.',
    },
    deletedSuccess: 'Tag deleted successfully.',
    deletedError: 'Failed to delete tag. Please try again.',
    schema: {
      required: 'Tag cannot be empty',
      maxLength: 'Tag is too long. Please keep it under 25 characters.',
      unique: 'This tag name already exists. Please choose another.',
    },
  },
  reusable: {
    header: {
      searchPlaceholder: 'Search...',
    },
    filters: {
      status: {
        all: 'All',
        completed: 'Completed',
        incomplete: 'Incomplete',
      },
      priority: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
      },
    },
    showModal,
    itemCheckmark: {
      completedSuccess: 'Quest marked as completed.',
      incompleteSuccess: 'Quest marked as incomplete.',
      updateError: 'Failed to update quest. Please try again.',
    },
    period: {
      /** Only ever shown when the backend says so — never derived from "not done yet". */
      atRisk: '⚠️ {{remaining}} to go, with {{count}} days left',
      atRisk_one: '⚠️ {{remaining}} to go, with {{count}} day left',
      periodEnds: 'Period ends {{date}}',
    },
    schedule: {
      once: 'One-off',
      daily: 'Every day',
      everyNDays: 'Every {{count}} days',
      timesPerWeek: '{{count}}× a week',
      timesPerMonth: '{{count}} days a month',
      /** A measured target on a week or month — the number carries a unit, so it is not a day count. */
      unitsPerWeek: '{{amount}} {{unit}} a week',
      unitsPerMonth: '{{amount}} {{unit}} a month',
      everyNWeeks: 'every {{count}} wks',
      everyNMonths: 'every {{count}} mos',
      everyNYears: 'every {{count}} yrs',
      monthWindow: 'Days {{start}}–{{end}} of the month',
      /** A year window that is not one of the four season presets. */
      yearWindow: 'Every year {{start}} – {{end}}',
      yearly: 'Every year',
      /** Appended to the recurrence when the target carries a unit: "Every day · 2 L". */
      targetSuffix: '{{amount}} {{unit}}',
      /** Appended when the target is a plain repeat count: "Every day · 2×". */
      targetTimes: '{{count}}×',
    },
    completion: {
      /** One tap that did not yet close the period — "2 / 3". */
      progressSaved: 'Saved: {{progress}}.',
      periodCompleted: 'Done! 🎉',
      rewardEarned: 'Done! 🎉 +{{xp}} XP, +{{coins}} coins',
      undone: 'Completion undone.',
      /** The backend rejected a second tap on the same day — the weekly cap did its job. */
      dailyLimitReached: 'Already done for today. Come back tomorrow.',
      error: 'Could not save. Please try again.',
      undoError: 'Could not undo. Please try again.',
      /** Shown instead of a button when the quest simply is not due today. */
      notScheduledToday: 'Not scheduled today',
    },
    form: {
      /* Title, description, dates, time and tags — they used to be spread into each per-type section. */
      ...questForm,
      startDayLabel: '🚀 Start Day:',
      endDayLabel: '🏁 End Day:',
      difficultyLabel: '⚔️ Difficulty:',
      difficultyPlaceholder: 'Select difficulty',
      difficulties: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        impossible: 'Impossible',
      },
      priorityLabel: '⚡ Priority:',
      priorityPlaceholder: 'Select priority',
      priorities: {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
      },
      seasonLabel: '🌦️ Season:',
      seasonPlaceholder: 'Select season',
      emojiLabel: '😄 Emoji:',
      emojiPlaceholder: 'Tap to pick emoji for quest',
      cancelButton: 'Cancel',
      recurrenceLabel: '🔁 Recurrence:',
      recurrencePlaceholder: 'How often?',
      presets: {
        once: 'One-off',
        daily: 'Every day',
        weekdays: 'On chosen weekdays',
        everyNDays: 'Every few days',
        timesPerWeek: 'X times a week',
        timesPerMonth: 'X days a month',
        unitsPerWeek: 'How much a week (e.g. 15 km)',
        unitsPerMonth: 'How much a month (e.g. 15 km)',
        monthWindow: 'Within a month window',
        seasonal: 'Seasonal',
      },
      intervalLabel: '📆 Every how many days:',
      /** The anchor is the start date, so without one the user cannot tell which days land. */
      intervalHint: 'Counted from the start date — set one so you can tell which days land.',
      timesPerWeekLabel: '🎯 Times a week:',
      timesPerMonthLabel: '🎯 Days a month:',
      /** The API takes `interval` on every unit, so a period longer than a day can repeat every N. */
      intervalWeeksLabel: '📆 Every how many weeks:',
      intervalMonthsLabel: '📆 Every how many months:',
      intervalYearsLabel: '📆 Every how many years:',
      periodIntervalHint: 'Leave it at 1 so the period comes back every time.',
      /** `maxCompletionsPerDay: 1` is what makes this preset mean anything. */
      timesPerPeriodHint: 'One tick a day — the whole week cannot be finished on a Monday.',
      targetAmountLabel: '🎯 Target per period:',
      targetUnitLabel: '📏 Unit (optional):',
      targetUnitPlaceholder: 'e.g. L, pages, min',
      targetHint: 'E.g. 2 with "Every day" means doing it twice a day. Leave it at 1 if a plain tick is enough.',
      maxPerDayLabel: '🔒 Max ticks per day:',
      /** 1 is what stops a weekly target from being finished in one sitting. */
      maxPerDayHint: 'Leave it at 1 so a whole week cannot be finished in one day.',
      durationLabel: '⏱️ How long it takes (min):',
      durationPlaceholder: 'e.g. 30',
      /** Nothing in the app reads it yet — it is there for the planned calendar export. */
      durationHint: 'Unused in the app for now — it is there for the planned calendar export.',
      /** The year window IS the recurrence — an end date would kill the quest after one season. */
      seasonalEndDateWarning: 'Do not set an end date — the season returns every year anyway.',
    },
    schema: {
      titleRequired: 'Title is required',
      titleMinLength: 'Title must be at least 3 characters',
      startDateInvalid: 'Start date cannot be earlier than allowed',
      endDateInvalid: 'End date must be after or equal to start date',
      tagIdRequired: 'Tag id is required',
      tagRequired: 'Tag cannot be empty',
      tagTooLong: 'Tag is too long. Please keep it under 25 characters.',
      recurrenceRequired: 'Pick a recurrence',
      weekdaysMin: 'Pick at least one weekday',
      intervalRange: 'Enter a number of days between 2 and 366',
      /** Without an anchor "every 2 days" is unpredictable, so the date stops being optional here. */
      intervalNeedsStartDate: 'Set a start date for "every few days" — the interval counts from it',
      timesPerWeekRange: 'Enter a number between 1 and 7',
      timesPerMonthRange: 'Enter a number between 1 and 31',
      monthDayRange: 'Day of the month must be between 1 and 31',
      monthWindowOrder: 'The end day cannot be earlier than the start day',
      seasonRequired: 'Pick a season',
      /** The year window is the recurrence — an end date would stop it after one season. */
      seasonalEndDateForbidden: 'A seasonal quest returns every year — leave the end date empty',
      targetAmountRange: 'Target must be a number between 1 and 100000',
      targetAmountWhole: 'Without a unit the target must be a whole number',
      targetUnitTooLong: 'A unit can be at most 20 characters',
      maxPerDayRange: 'Enter a number between 1 and the target',
      periodIntervalRange: 'Enter a whole number between 1 and 366',
      durationRange: 'Duration must be a whole number between 1 and 1440 minutes',
    },
    difficulty: {
      prefix: 'Difficulty:',
      descriptions: {
        easy: 'Low effort, beginner friendly',
        medium: 'Moderate challenge',
        hard: 'High difficulty, advanced level',
        impossible: 'Near impossible, extreme challenge',
      },
    },
    priority: {
      prefix: 'Priority:',
      descriptions: {
        high: 'Requires immediate attention',
        medium: 'Moderate importance',
        low: 'Low priority, can wait',
      },
    },
    season: {
      prefix: 'Season:',
      descriptions: {
        winter: 'Cold and snowy season',
        spring: 'Season of growth and renewal',
        summer: 'Hot and sunny days',
        autumn: 'Cool and colorful fall',
      },
    },
    status: {
      completedTitle: 'Completed',
      completedDescription: 'Well done! This quest has been completed.',
      inProgressTitle: 'In Progress',
      inProgressDescription: 'This quest is currently active. Keep pushing toward completion!',
    },
    dates: {
      heading: 'Dates',
      notSet: 'Not set',
      startDateLabel: 'Start Date:',
      endDateLabel: 'End Date:',
      timeRemainingLabel: 'Time Remaining:',
      expired: '(⏰ Expired)',
      noDeadline: '(No deadline)',
      lastDay: '(⚡ Last day!)',
      daysLeftUrgent: '(⏳ {{count}} days left)',
      daysLeftWarning: '(🕒 {{count}} days left)',
      daysLeftNormal: '({{count}} days left)',
    },
    scheduled: {
      heading: 'Scheduled Time',
      timeOfDay: {
        earlyMorning: '🌙 Early Morning',
        morning: '☀️ Morning',
        afternoon: '🌤️ Afternoon',
        evening: '🌃 Evening',
        night: '🌌 Night',
      },
    },
    statistics: {
      heading: 'Statistics',
      completed: 'Completed',
      occurrences: 'Occurrences',
      failures: 'Failures',
      streak: 'Streak',
      longest: 'Longest',
      /** A streak of 5 on a weekly habit is five weeks — without the unit the number lies. */
      streakUnit: {
        Day: 'days',
        Week: 'wks',
        Month: 'mos',
        Year: 'yrs',
        None: '',
      },
    },
    days: {
      monday: 'Mon',
      tuesday: 'Tues',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun',
    },
    weekly: {
      daysLabel: 'Days:',
      heading: 'Repeats On',
      allDays: 'All Days',
    },
    monthly: {
      heading: 'Occurs On',
    },
    tags: {
      heading: 'Quest Tags:',
    },
    description: {
      heading: 'Description:',
    },
    timePicker: {
      setTimeButton: 'Set Time',
    },
  },
  analytics: {
    loading: 'Loading statistics...',
    openFromQuest: 'See full statistics',
    rangeLabel: 'Range: {{from}} – {{to}}',
    range: {
      days: '{{days}} days',
    },
    outcome: {
      completed: 'Done',
      backfilled: 'Backfilled',
      missed: 'Missed',
      pending: 'In progress',
      /** Elapsed with some progress but short of the target — counts as a miss, drawn as partial credit. */
      partial: 'Partial',
      unscheduled: 'Not scheduled',
    },
    summary: {
      completionRate: 'Success rate',
      currentStreak: 'Streak',
      longestStreak: 'Longest',
      inRange: 'in range',
      allTime: 'all time',
      periodsHeading: 'Period breakdown',
      periodsBreakdown: 'Done: {{completed}} · Partial: {{partial}} · Missed: {{missed}} · In progress: {{pending}}',
      /** How much of what was asked for actually got done, unlike completionRate which is all-or-nothing. */
      progressRate: 'Progress',
    },
    heatmap: {
      heading: 'Calendar',
      hint: 'An empty cell is a day the habit was not scheduled on.',
    },
    trend: {
      heading: 'Success rate trend',
      hint: 'A dash instead of a bar means nothing was scheduled in that period.',
      granularity: {
        day: 'by day',
        week: 'by week',
        month: 'by month',
      },
    },
    hour: {
      heading: 'Time of day',
      hint: 'When you actually do this. Rows migrated from the old model carry no hour and are skipped.',
      /** e.g. "7:00-8:00" */
      hourLabel: '{{hour}}:00',
    },
    weekday: {
      heading: 'Days of the week',
      hint: 'Which days this tends to slip on.',
      /** Used when the schedule pins no weekdays, so "slips" has no denominator to be measured against. */
      hintActivity: 'When you actually get this done.',
      /** e.g. "9 of 12 Mondays" */
      scheduledRatio: '{{done}} of {{scheduled}}',
      completionsCount: '{{count}} completions',
    },
    empty: {
      heading: 'No occurrences in this range',
      hint: 'Pick a longer range, or give the habit time to build up.',
    },
    error: {
      heading: 'Could not load the statistics',
      hint: 'Statistics are only available for repeating quests — a one-off has no streak or trend.',
    },
    overview: {
      title: 'Habit statistics',
      donePeriods: 'Done',
      habitsCount: 'Habits',
      repeatable: 'repeatable',
      dailyRateHeading: 'Day by day',
      dailyRateHint: 'What share of the scheduled habits you completed on each day.',
      scaleLess: 'less',
      scaleMore: 'more',
      rankingHeading: 'Your habits',
      rankingHint: 'From the best kept to the ones needing attention.',
      questMeta: 'Done {{completed}} of {{evaluated}}',
      questNoData: 'No evaluated periods in this range',
      emptyHeading: 'No repeatable habits yet',
      emptyHint: 'Add a repeating quest to see statistics here.',
      /** Week/Month/Year periods have no place on a per-day axis, so they get their own tile. */
      periodicHeading: 'Weekly periods and longer',
      periodicHint: 'Weekly, monthly and yearly targets counted separately — one missed week no longer paints seven days red.',
      dailyOnlyNote: 'The per-day chart shows daily habits only.',
    },
  },
};

export default quests;
