const goals = {
  header: {
    daily: 'Cel dzienny',
    weekly: 'Cel tygodniowy',
    monthly: 'Cel miesięczny',
    yearly: 'Cel roczny',
  },
  timeSection: {
    title: 'Pozostały czas',
    units: {
      months: 'miesięcy',
      weeks: 'tygodni',
      days: 'dni',
      hours: 'godzin',
      minutes: 'minut',
      seconds: 'sekund',
    },
  },
  questSection: {
    title: 'Cel',
    emptyState: '🎯 Ustaw cel, aby zacząć! 🎯',
  },
  setButton: {
    label: 'Ustaw cel',
  },
  completionButton: {
    label: 'Zakończ',
  },
  setModal: {
    loadingQuests: 'Wczytywanie zadań...',
    title: 'Ustaw cel',
    selectPlaceholder: 'Wybierz zadanie',
    previewLabel: 'Podgląd wybranego zadania:',
    setButton: 'Ustaw',
    setSuccess: 'Cel został ustawiony!',
    setError: 'Nie udało się ustawić celu. Spróbuj ponownie.',
  },
  questItemModal: {
    completed: 'Zakończone',
    occurrences: 'Wystąpienia',
    failures: 'Niepowodzenia',
    streak: 'Seria',
  },
  screens: {
    loadingQuests: 'Wczytywanie zadań...',
    completeSuccess: 'Cel oznaczony jako zakończony!',
    completeError: 'Nie udało się zakończyć celu. Spróbuj ponownie.',
    confirmTitle: 'Zakończyć zadanie?',
    confirmMessage: 'Czy na pewno chcesz oznaczyć to zadanie jako zakończone?',
  },
};

export default goals;
