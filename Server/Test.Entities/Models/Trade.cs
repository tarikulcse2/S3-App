using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Test.Entities.Models
{
    [Table("Trades")]
    public class Trade
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int TradeId { get; set; }
        public int Level { get; set; }
        public string Language { get; set; }
        public string SyllabusName { get; set; }
        public string SyllbusFileName { get; set; }
        public string PlanFileName { get; set; }
        public string DevOffer { get; set; }
        public string Manager { get; set; }
        public DateTime ActiveDate { get; set; }
        public DateTime EntyDate { get; set; }
        public DateTime? UpdateDate { get; set; }
    }
}