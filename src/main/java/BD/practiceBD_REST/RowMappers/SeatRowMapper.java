package BD.practiceBD_REST.RowMappers;

import BD.practiceBD_REST.Objects.Seat;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class SeatRowMapper implements RowMapper<Seat> {
    @Override
    public Seat mapRow(ResultSet rs, int rowNum) throws SQLException {
        Seat seat = new Seat();
        seat.setId(rs.getInt("ид"));
        seat.setId_classroom(rs.getInt("ид_класса"));
        seat.setNumber(rs.getString("номер_учебного_места"));
        seat.setWS_name(rs.getString("имя_рабочей_станции"));
        seat.setIp(rs.getString("ip_адрес"));
        seat.setNote(rs.getString("примечание"));
        return seat;
    }
}
