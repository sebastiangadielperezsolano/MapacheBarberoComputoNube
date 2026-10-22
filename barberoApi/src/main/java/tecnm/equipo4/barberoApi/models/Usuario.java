package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "usuario")
@Inheritance(strategy = InheritanceType.JOINED)
@JsonIgnoreProperties(ignoreUnknown = true)
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "nombre_completo")
    private String nombreCompleto;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "password")
    private String password;

    @Column(name = "perfil")
    private String perfil;

    @Column(name = "tipo_usuario")
    private String tipoUsuario;
}