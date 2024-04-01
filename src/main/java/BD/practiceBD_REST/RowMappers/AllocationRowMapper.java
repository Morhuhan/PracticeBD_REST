package BD.practiceBD_REST.RowMappers;

import BD.practiceBD_REST.Objects.Allocation;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

public class AllocationRowMapper implements RowMapper<Allocation> {

    @Override
    public Allocation mapRow(ResultSet rs, int rowNum) throws SQLException {
        Allocation allocation = new Allocation();
        allocation.setId(rs.getInt("ид"));
        allocation.setPref(rs.getString("префикс_улицы"));
        allocation.setStreet(rs.getString("улица"));
        allocation.setHouse(rs.getString("дом"));
        allocation.setRoom(rs.getString("помещение"));
        allocation.setPhone(rs.getString("номер_телефона"));
        return allocation;
    }
}

