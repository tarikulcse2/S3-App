using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Test.Entities.DBContext;
using Test.Entities.Models;
using Test.Entities.ViewModel;

namespace Test.Repository
{
    public interface ITradeRepository
    {
        TradePaging GetAll(int page, int size, int tradeId, int level);
        bool Insert(Trade trade);
        bool Update(Trade trade);
    }
    public class TradeRepository : ITradeRepository
    {
        private readonly TestDBContext _db;
        public TradeRepository(TestDBContext db)
        {
            _db = db;
        }

        TradePaging ITradeRepository.GetAll(int page, int size, int tradeId, int level)
        {
            TradePaging obj = new TradePaging();
            obj.Data = _db.Trades.Where(s => 
            s.TradeId == (tradeId > 0 ? tradeId : s.TradeId) && 
            s.Level == (level > 0 ? level : s.Level)
            ).OrderByDescending(e => e.Id).Skip((page - 1) * size).Take(size).ToList();
            obj.TotalPage = _db.Trades.Count(s => 
            s.TradeId == (tradeId > 0 ? tradeId : s.TradeId) && 
            s.Level == (level > 0 ? level : s.Level));
            return obj;
        }

        bool ITradeRepository.Insert(Trade trade)
        {
            _db.Trades.Add(trade);
            return _db.SaveChanges() > 0;
        }

        bool ITradeRepository.Update(Trade trade)
        {
            _db.Trades.Update(trade);
            return _db.SaveChanges() > 0;
        }
    }
}