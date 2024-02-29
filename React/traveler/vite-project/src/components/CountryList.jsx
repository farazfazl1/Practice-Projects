import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCities } from "../contexts/CitiesContext";
function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map to have a country as well" />
    );

  const countries = cities.reduce((acc, cur) => {
    // Check if the current country is already included in the accumulator
    if (!acc.find((el) => el.country === cur.country)) {
      return [
        ...acc,
        {
          country: cur.country,
          emoji: cur.emoji,
        },
      ];
    } else {
      return acc; // Return the accumulator as is if the country is already included
    }
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}

export default CountryList;
