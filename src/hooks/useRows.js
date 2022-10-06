
export default function useRows() {
  //API call to retrieve rows

  const rows = [
      {
        date: 1,
        lib: "Vetement Zara",
        value: -12,
        solde: 0,
        recurrent: true,
      },
      {
        date: 4,
        lib: "Sandwich Ange",
        value: -7.5,
        solde: 0,
        recurrent: true,
      },
      {
        date: 2,
        lib: "Virement Cadeau Noel",
        value: 12,
        solde: 0,
        recurrent: false,
      },
      {
        date: 4,
        lib: "Essence",
        value: -52,
        solde: 0,
        recurrent: false,
      },
    ]

  return rows;
}
