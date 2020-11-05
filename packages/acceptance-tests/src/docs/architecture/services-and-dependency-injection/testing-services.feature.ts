// std
import { strictEqual } from 'assert';

// FoalTS
import { createService, dependency } from '@foal/core';

describe('Feature: Testing services', () => {

  describe('Example: A service with no dependencies', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    // calculator.service.ts
    class CalculatorService {
      sum(a: number, b: number): number {
        return a + b;
      }
    }

    // calculator.service.spec.ts
    it('CalculatorService', () => {
      const service = new CalculatorService();
      strictEqual(service.sum(1, 2), 3);
    });

    /* ======================= DOCUMENTATION END ========================= */

  });

  describe('Example: A service with dependencies', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    // weather.service.ts
    class ConversionService {
      celsiusToFahrenheit(temperature: number): number {
        return temperature * 9 / 5 + 32;
      }
    }

    class WeatherService {
      temp = 14;

      @dependency
      conversion: ConversionService;

      getWeather(): string {
        const temp = this.conversion.celsiusToFahrenheit(this.temp);
        return `The outside temperature is ${temp} °F.`;
      }
    }

    // weather.service.spec.ts
    it('WeatherService', () => {
      const service = createService(WeatherService);

      const expected = 'The outside temperature is 57.2 °F.';
      const actual = service.getWeather();

      strictEqual(actual, expected);
    });

    /* ======================= DOCUMENTATION END ========================= */

  });

  describe('Example: A service with dependencies mocked', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    // detector.service.ts
    class TwitterService {
      fetchLastTweets(): { msg: string }[] {
        // Make a call to the Twitter API to get the last tweets.
        return [];
      }
    }

    class DetectorService {
      @dependency
      twitter: TwitterService;

      isFoalTSMentionedInTheLastTweets() {
        const tweets = this.twitter.fetchLastTweets();
        if (tweets.find(tweet => tweet.msg.includes('FoalTS'))) {
          return true;
        }
        return false;
      }
    }

    // detector.service.spec.ts
    it('DetectorService', () => {
      const twitterMock = {
        fetchLastTweets() {
          return [
            { msg: 'Hello world!' },
            { msg: 'I LOVE FoalTS' },
          ];
        }
      };
      const service = createService(DetectorService, {
        twitter: twitterMock
      });

      const actual = service.isFoalTSMentionedInTheLastTweets();

      strictEqual(actual, true);
    });

    /* ======================= DOCUMENTATION END ========================= */

  });

});
