const goals = {
  header: {
    daily: 'Daily goal',
    weekly: 'Weekly goal',
    monthly: 'Monthly goal',
    yearly: 'Yearly goal',
  },
  timeSection: {
    title: 'Time Left',
    units: {
      months: 'months',
      weeks: 'weeks',
      days: 'days',
      hours: 'hours',
      minutes: 'minutes',
      seconds: 'seconds',
    },
  },
  questSection: {
    title: 'Goal',
    emptyState: '🎯 Set a goal to get started! 🎯',
  },
  setButton: {
    label: 'Set goal',
  },
  completionButton: {
    label: 'Complete',
  },
  setModal: {
    loadingQuests: 'Loading quests...',
    title: 'Set goal',
    selectPlaceholder: 'Select a quest',
    previewLabel: 'Preview selected quest:',
    setButton: 'Set',
    setSuccess: 'Goal set successfully!',
    setError: 'Failed to set goal. Please try again.',
  },
  questItemModal: {
    completed: 'Completed',
    occurrences: 'Occurrences',
    failures: 'Failures',
    streak: 'Streak',
  },
  screens: {
    loadingQuests: 'Fetching quests...',
    completeSuccess: 'Goal marked as completed!',
    completeError: 'Failed to complete goal. Please try again.',
    confirmTitle: 'Complete Quest?',
    confirmMessage: 'Are you sure you want to mark this quest as completed?',
  },
};

export default goals;
