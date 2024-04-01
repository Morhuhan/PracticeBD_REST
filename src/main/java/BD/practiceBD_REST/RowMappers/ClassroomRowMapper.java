package BD.practiceBD_REST.RowMappers;
import BD.practiceBD_REST.Objects.Classroom;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ClassroomRowMapper implements RowMapper<Classroom> {
    @Override
    public Classroom mapRow(ResultSet rs, int rowNum) throws SQLException {
        Classroom classroom = new Classroom();
        classroom.setId(rs.getInt("ид"));
        classroom.setId_allocation(rs.getInt("ид_местоположения"));
        classroom.setCurrent_num_of_places(rs.getInt("текущ_количество_мест"));
        classroom.setMax_num_of_places(rs.getInt("макс_количество_мест"));
        classroom.setDepartment(rs.getString("кафедра"));
        classroom.setNote(rs.getString("примечание"));
        return classroom;
    }
}


