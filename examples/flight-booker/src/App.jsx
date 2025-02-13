import { ref, computed } from '@unisonjs/vue';

function App() {
  const flightType = ref('one-way flight');
  const departureDate = ref(dateToString(new Date()));
  const returnDate = ref(departureDate.value);

  const isReturn = computed(() => flightType.value === 'return flight');

  const canBook = computed(
    () =>
      !isReturn.value ||
      stringToDate(returnDate.value) > stringToDate(departureDate.value)
  );

  function book() {
    alert(
      isReturn.value
        ? `You have booked a return flight leaving on ${departureDate.value} and returning on ${returnDate.value}.`
        : `You have booked a one-way flight leaving on ${departureDate.value}.`
    );
  }

  function stringToDate(str) {
    const [y, m, d] = str.split('-');
    return new Date(+y, m - 1, +d);
  }

  function dateToString(date) {
    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate())
    );
  }

  function pad(n, s = String(n)) {
    return s.length < 2 ? `0${s}` : s;
  }

  return (
    <div className="space-y-2 p-4 max-w-xs mx-auto">
      <select
        className="block w-full p-2 border rounded"
        value={flightType.value}
        onChange={(e) => (flightType.value = e.target.value)}
      >
        <option value="one-way flight">One-way Flight</option>
        <option value="return flight">Return Flight</option>
      </select>

      <input
        className="block w-full p-2 border rounded"
        type="date"
        value={departureDate.value}
        onInput={(e) => (departureDate.value = e.target.value)}
      />
      <input
        className="block w-full p-2 border rounded disabled:text-gray-400"
        type="date"
        value={returnDate.value}
        onInput={(e) => (returnDate.value = e.target.value)}
        disabled={!isReturn.value}
      />

      <button
        className="block w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        disabled={!canBook.value}
        onClick={book}
      >
        Book
      </button>

      {!canBook.value && (
        <p className="text-red-500 text-sm">Return date must be after departure date.</p>
      )}
    </div>
  );
}

export default App;
