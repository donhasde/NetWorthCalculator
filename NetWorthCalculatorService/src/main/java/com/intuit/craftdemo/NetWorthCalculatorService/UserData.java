package com.intuit.craftdemo.NetWorthCalculatorService;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserData {
	@JsonProperty("baseCurrencyCode")
	private String baseCurrencyCode;
	@JsonProperty("targetCurrencyCode")
	private String targetCurrencyCode;
	@JsonProperty("assets")
	private Map<String, Float> assets;
	@JsonProperty("liabilities")
	private Map<String, Float> liabilities;

	@JsonProperty("totalNetWorth")
	private float totalNetWorth;
	@JsonProperty("totalAssets")
	private float totalAssets;
	@JsonProperty("totalLiabilities")
	private float totalLiabilities;

	public String getBaseCurrencyCode() {
		return baseCurrencyCode;
	}

	public void setBaseCurrencyCode(String currency) {
		baseCurrencyCode = currency;
	}

	public String getTargetCurrencyCode() {
		return targetCurrencyCode;
	}

	public void setTargetCurrencyCode(String currency) {
		targetCurrencyCode = currency;
	}

	public Map<String, Float> getAssets() {
		return assets;
	}

	public void setAssets(Map<String, Float> assets) {
		this.assets = assets;
	}

	public Map<String, Float> getLiabilities() {
		return liabilities;
	}

	public void setLiabilities(Map<String, Float> liabilities) {
		this.liabilities = liabilities;
	}

	public float getTotalNetWorth() {
		return totalNetWorth;
	}

	public void setTotalNetWorth(float netWorth) {
		totalNetWorth = netWorth;
	}

	public float getTotalAssets() {
		return totalAssets;
	}

	public void setTotalAssets(float assets) {
		totalAssets = assets;
	}

	public float getTotalLiabilities() {
		return totalLiabilities;
	}

	public void setTotalLiabilities(float liabilities) {
		totalLiabilities = liabilities;
	}
}
