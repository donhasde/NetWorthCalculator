package com.intuit.craftdemo.NetWorthCalculatorService;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NetWorthCalculatorService {
	@Autowired
	FreeCurrencyConverterClient forexClient;

	private final ConcurrentMap<Long, UserData> database = new ConcurrentHashMap<>();

	public UserData calculateNetWorth(UserData input) {
		float exchangeRate = 1.0f;
		String baseCurrency = input.getBaseCurrencyCode();
		String targetCurrency = input.getTargetCurrencyCode();
		String finalCurrency = baseCurrency;
		if (StringUtils.isNotEmpty(targetCurrency) && !StringUtils.equals(baseCurrency, targetCurrency)) {
			finalCurrency = targetCurrency;
			exchangeRate = forexClient.getExchangeRate(baseCurrency, targetCurrency);
		}

		float totalAssets = 0;
		Map<String, Float> assets = new HashMap<>();
		if (input.getAssets() != null) {
			for (Map.Entry<String, Float> entry : input.getAssets().entrySet()) {
				float adjustedValue = entry.getValue() * exchangeRate;
				totalAssets += adjustedValue;
				assets.put(entry.getKey(), adjustedValue);
			}
		}

		float totalLiabilities = 0;
		Map<String, Float> liabilities = new HashMap<>();
		if (input.getLiabilities() != null) {
			for (Map.Entry<String, Float> entry : input.getLiabilities().entrySet()) {
				float adjustedValue = entry.getValue() * exchangeRate;
				totalLiabilities += adjustedValue;
				liabilities.put(entry.getKey(), adjustedValue);
			}
		}

		float totalNetWorth = totalAssets - totalLiabilities;

		// Build the return output
		UserData output = new UserData();
		output.setUserId(input.getUserId());
		output.setBaseCurrencyCode(finalCurrency);
		output.setTargetCurrencyCode(null);
		output.setAssets(assets);
		output.setLiabilities(liabilities);
		output.setTotalNetWorth(totalNetWorth);
		output.setTotalAssets(totalAssets);
		output.setTotalLiabilities(totalLiabilities);

		database.put(input.getUserId(), output);

		return output;
	}

	public UserData getOrCreateUser(Long userId) {
		if (database.containsKey(userId))
			return database.get(userId);

		// Automatically create the user if they don't exist
		UserData output = new UserData();
		output.setUserId(userId);
		database.put(userId, output);
		return output;
	}
}