using System;
using System.Collections.Generic;
using Test.Entities.Models;
using Test.Entities.ViewModel;
using Test.Repository;

namespace Test.Service
{
    public interface ITradeService
    {
        TradePaging GetAll(int page, int size, int tradeId, int level);
        bool Insert(Trade trade);
        bool Update(Trade trade);
    }
    public class TradeService : ITradeService
    {
        private readonly ITradeRepository _tradeRepository;
        public TradeService(ITradeRepository tradeRepository)
        {
            _tradeRepository = tradeRepository;   
        }
        TradePaging ITradeService.GetAll(int page, int size, int tradeId, int level)
        {
            return _tradeRepository.GetAll(page, size, tradeId, level);
        }

        bool ITradeService.Insert(Trade trade)
        {
            return _tradeRepository.Insert(trade);
        }

        bool ITradeService.Update(Trade trade)
        {
            return _tradeRepository.Update(trade);
        }
    }
}
